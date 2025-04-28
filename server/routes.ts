import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GeminiAI } from "./ai/gemini";
import multer from "multer";
import path from "path";
import { NextFunction } from "express";

// Initialize the AI service
const ai = new GeminiAI();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // ===== Glossary Routes =====
  
  // Get glossary categories
  app.get('/api/glossary/categories', async (_req, res) => {
    try {
      const categories = await storage.getGlossaryCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching glossary categories:', error);
      res.status(500).json({ message: 'Failed to fetch glossary categories' });
    }
  });
  
  // Get glossary terms (optionally filtered by category)
  app.get('/api/glossary/terms/:category?', async (req, res) => {
    try {
      const category = req.params.category !== 'all' ? req.params.category : undefined;
      const terms = await storage.getGlossaryTerms(category);
      res.json(terms);
    } catch (error) {
      console.error('Error fetching glossary terms:', error);
      res.status(500).json({ message: 'Failed to fetch glossary terms' });
    }
  });
  
  // Get a specific glossary term by ID
  app.get('/api/glossary/term/:id?', async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ message: 'Term ID is required' });
      }
      
      const termId = parseInt(req.params.id);
      if (isNaN(termId)) {
        return res.status(400).json({ message: 'Invalid term ID' });
      }
      
      const term = await storage.getGlossaryTerm(termId);
      if (!term) {
        return res.status(404).json({ message: 'Term not found' });
      }
      
      res.json(term);
    } catch (error) {
      console.error('Error fetching glossary term:', error);
      res.status(500).json({ message: 'Failed to fetch glossary term' });
    }
  });
  
  // ===== News Routes =====
  
  // Get all news
  app.get('/api/news', async (req, res) => {
    try {
      const category = req.query.category as string;
      const news = await storage.getLegalNews(category !== 'all' ? category : undefined);
      res.json(news);
    } catch (error) {
      console.error('Error fetching legal news:', error);
      res.status(500).json({ message: 'Failed to fetch legal news' });
    }
  });
  
  // Get featured/latest news
  app.get('/api/news/featured', async (_req, res) => {
    try {
      const featuredNews = await storage.getFeaturedNews();
      res.json(featuredNews);
    } catch (error) {
      console.error('Error fetching featured news:', error);
      res.status(500).json({ message: 'Failed to fetch featured news' });
    }
  });
  
  // ===== Expert Directory Routes =====
  
  // Get experts (optionally filtered by specialty and location)
  app.get('/api/experts', async (req, res) => {
    try {
      const specialty = req.query.specialty as string;
      const location = req.query.location as string;
      
      const specialtyFilter = specialty !== 'all' ? specialty : undefined;
      const locationFilter = location !== 'all' ? location : undefined;
      
      const experts = await storage.getLegalExperts(specialtyFilter, locationFilter);
      res.json(experts);
    } catch (error) {
      console.error('Error fetching legal experts:', error);
      res.status(500).json({ message: 'Failed to fetch legal experts' });
    }
  });
  
  // Get featured experts
  app.get('/api/experts/featured', async (_req, res) => {
    try {
      const featuredExperts = await storage.getFeaturedExperts();
      res.json(featuredExperts);
    } catch (error) {
      console.error('Error fetching featured experts:', error);
      res.status(500).json({ message: 'Failed to fetch featured experts' });
    }
  });
  
  // Get expert specialties
  app.get('/api/experts/specialties', async (_req, res) => {
    try {
      const specialties = await storage.getExpertSpecialties();
      res.json(specialties);
    } catch (error) {
      console.error('Error fetching expert specialties:', error);
      res.status(500).json({ message: 'Failed to fetch expert specialties' });
    }
  });
  
  // Get expert locations
  app.get('/api/experts/locations', async (_req, res) => {
    try {
      const locations = await storage.getExpertLocations();
      res.json(locations);
    } catch (error) {
      console.error('Error fetching expert locations:', error);
      res.status(500).json({ message: 'Failed to fetch expert locations' });
    }
  });
  
  // ===== AI Q&A Routes =====
  
  // Process AI query
  app.post('/api/ai/query', async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Invalid query' });
      }
      
      const { response, citations } = await ai.generateResponse(query);
      
      // Save the conversation
      await storage.saveAiConversation({
        userId: null, // For now, no user authentication
        query,
        response,
        citations,
      });
      
      res.json({ response, citations });
    } catch (error) {
      console.error('Error processing AI query:', error);
      res.status(500).json({ message: 'Failed to process your query' });
    }
  });
  
  // ===== Document Analysis Routes =====
  
  // Upload document
  app.post('/api/documents/upload', upload.single('document'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const file = req.file;
      const fileContent = file.buffer.toString('utf-8');
      
      const document = await storage.saveUserDocument({
        userId: null, // For now, no user authentication
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        content: fileContent,
      });
      
      res.json({
        documentId: document.id,
        message: 'Document uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      res.status(500).json({ message: 'Failed to upload document' });
    }
  });
  
  // Analyze document
  app.get('/api/documents/analyze/:documentId?', async (req, res) => {
    try {
      if (!req.params.documentId) {
        // Handle the case where no document ID is provided
        return res.json({
          summary: "No document selected. Please upload a document first.",
          documentType: "None",
          keyInformation: [],
          potentialRisks: [],
          complianceChecks: []
        });
      }
      
      const documentId = parseInt(req.params.documentId);
      
      if (isNaN(documentId)) {
        return res.status(400).json({ message: 'Invalid document ID' });
      }
      
      const document = await storage.getUserDocument(documentId);
      
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      // Check if analysis already exists
      if (document.analysisResult) {
        return res.json(document.analysisResult);
      }
      
      // Perform new analysis with AI
      const analysisResult = await ai.analyzeDocument(document.content || "");
      
      // Save analysis result
      await storage.updateDocumentAnalysis(documentId, analysisResult);
      
      res.json(analysisResult);
    } catch (error) {
      console.error('Error analyzing document:', error);
      res.status(500).json({ message: 'Failed to analyze document' });
    }
  });
  
  // ===== Legal Quizzes Routes =====
  
  // Get quizzes
  app.get('/api/quizzes', async (req, res) => {
    try {
      const category = req.query.category as string;
      const quizzes = await storage.getLegalQuizzes(category !== 'all' ? category : undefined);
      res.json(quizzes);
    } catch (error) {
      console.error('Error fetching legal quizzes:', error);
      res.status(500).json({ message: 'Failed to fetch legal quizzes' });
    }
  });
  
  // Get quiz by ID with questions
  app.get('/api/quizzes/:quizId', async (req, res) => {
    try {
      const quizId = parseInt(req.params.quizId);
      
      if (isNaN(quizId)) {
        return res.status(400).json({ message: 'Invalid quiz ID' });
      }
      
      const quiz = await storage.getLegalQuizWithQuestions(quizId);
      
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      
      res.json(quiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      res.status(500).json({ message: 'Failed to fetch quiz' });
    }
  });
  
  // Submit quiz attempt
  app.post('/api/quizzes/:quizId/submit', async (req, res) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const { answers } = req.body;
      
      if (isNaN(quizId)) {
        return res.status(400).json({ message: 'Invalid quiz ID' });
      }
      
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: 'Invalid answers format' });
      }
      
      const quiz = await storage.getLegalQuizWithQuestions(quizId);
      
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      
      // Calculate score
      let score = 0;
      const questions = quiz.questions || [];
      
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const userAnswer = answers[i];
        
        if (userAnswer === question.correctOption) {
          score++;
        }
      }
      
      // Save quiz attempt
      const quizAttempt = await storage.saveUserQuizAttempt({
        userId: null, // For now, no user authentication
        quizId,
        score,
        answers: { userAnswers: answers },
      });
      
      res.json({
        score,
        totalQuestions: questions.length,
        percentage: (score / questions.length) * 100,
        attemptId: quizAttempt.id
      });
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      res.status(500).json({ message: 'Failed to submit quiz attempt' });
    }
  });

  return httpServer;
}

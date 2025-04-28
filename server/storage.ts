import {
  User, InsertUser,
  GlossaryCategory, InsertGlossaryCategory,
  GlossaryTerm, InsertGlossaryTerm,
  LegalNews, InsertLegalNews,
  LegalExpert, InsertLegalExpert,
  UserDocument, InsertUserDocument,
  AiConversation, InsertAiConversation,
  LegalQuiz, InsertLegalQuiz,
  QuizQuestion, InsertQuizQuestion,
  UserQuizAttempt, InsertUserQuizAttempt,
  ExpertSpecialty, InsertExpertSpecialty,
  ExpertLocation, InsertExpertLocation
} from "@shared/schema";

// Define the storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Glossary methods
  getGlossaryCategories(): Promise<GlossaryCategory[]>;
  getGlossaryTerms(category?: string): Promise<GlossaryTerm[]>;
  getGlossaryTerm(id: number): Promise<GlossaryTerm | undefined>;
  createGlossaryTerm(term: InsertGlossaryTerm): Promise<GlossaryTerm>;
  
  // News methods
  getLegalNews(category?: string): Promise<LegalNews[]>;
  getFeaturedNews(): Promise<LegalNews[]>;
  getLegalNewsById(id: number): Promise<LegalNews | undefined>;
  createLegalNews(news: InsertLegalNews): Promise<LegalNews>;
  
  // Experts methods
  getLegalExperts(specialty?: string, location?: string): Promise<LegalExpert[]>;
  getFeaturedExperts(): Promise<LegalExpert[]>;
  getLegalExpertById(id: number): Promise<LegalExpert | undefined>;
  createLegalExpert(expert: InsertLegalExpert): Promise<LegalExpert>;
  getExpertSpecialties(): Promise<ExpertSpecialty[]>;
  getExpertLocations(): Promise<ExpertLocation[]>;
  
  // Document methods
  getUserDocument(id: number): Promise<UserDocument | undefined>;
  saveUserDocument(document: InsertUserDocument): Promise<UserDocument>;
  updateDocumentAnalysis(id: number, analysisResult: any): Promise<UserDocument>;
  
  // AI Conversation methods
  saveAiConversation(conversation: InsertAiConversation): Promise<AiConversation>;
  getUserConversations(userId: number): Promise<AiConversation[]>;
  
  // Quiz methods
  getLegalQuizzes(category?: string): Promise<LegalQuiz[]>;
  getLegalQuizById(id: number): Promise<LegalQuiz | undefined>;
  getLegalQuizWithQuestions(id: number): Promise<(LegalQuiz & { questions: QuizQuestion[] }) | undefined>;
  createLegalQuiz(quiz: InsertLegalQuiz): Promise<LegalQuiz>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  saveUserQuizAttempt(attempt: InsertUserQuizAttempt): Promise<UserQuizAttempt>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private glossaryCategories: Map<number, GlossaryCategory>;
  private glossaryTerms: Map<number, GlossaryTerm>;
  private legalNews: Map<number, LegalNews>;
  private legalExperts: Map<number, LegalExpert>;
  private userDocuments: Map<number, UserDocument>;
  private aiConversations: Map<number, AiConversation>;
  private legalQuizzes: Map<number, LegalQuiz>;
  private quizQuestions: Map<number, QuizQuestion>;
  private userQuizAttempts: Map<number, UserQuizAttempt>;
  private expertSpecialties: Map<number, ExpertSpecialty>;
  private expertLocations: Map<number, ExpertLocation>;
  
  private userId: number = 1;
  private glossaryCategoryId: number = 1;
  private glossaryTermId: number = 1;
  private legalNewsId: number = 1;
  private legalExpertId: number = 1;
  private userDocumentId: number = 1;
  private aiConversationId: number = 1;
  private legalQuizId: number = 1;
  private quizQuestionId: number = 1;
  private userQuizAttemptId: number = 1;
  private expertSpecialtyId: number = 1;
  private expertLocationId: number = 1;
  
  constructor() {
    this.users = new Map();
    this.glossaryCategories = new Map();
    this.glossaryTerms = new Map();
    this.legalNews = new Map();
    this.legalExperts = new Map();
    this.userDocuments = new Map();
    this.aiConversations = new Map();
    this.legalQuizzes = new Map();
    this.quizQuestions = new Map();
    this.userQuizAttempts = new Map();
    this.expertSpecialties = new Map();
    this.expertLocations = new Map();
    
    // Initialize with sample data
    this.initializeData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: "user", 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Glossary methods
  async getGlossaryCategories(): Promise<GlossaryCategory[]> {
    return Array.from(this.glossaryCategories.values());
  }
  
  async getGlossaryTerms(category?: string): Promise<GlossaryTerm[]> {
    const terms = Array.from(this.glossaryTerms.values());
    
    if (!category) {
      return terms;
    }
    
    // Get category ID by value
    const categoryObj = Array.from(this.glossaryCategories.values()).find(
      cat => cat.value === category
    );
    
    if (!categoryObj) {
      return [];
    }
    
    return terms.filter(term => term.categoryId === categoryObj.id);
  }
  
  async getGlossaryTerm(id: number): Promise<GlossaryTerm | undefined> {
    return this.glossaryTerms.get(id);
  }
  
  async createGlossaryTerm(insertTerm: InsertGlossaryTerm): Promise<GlossaryTerm> {
    const id = this.glossaryTermId++;
    const term: GlossaryTerm = { 
      ...insertTerm, 
      id, 
      createdAt: new Date() 
    };
    this.glossaryTerms.set(id, term);
    return term;
  }
  
  // News methods
  async getLegalNews(category?: string): Promise<LegalNews[]> {
    const news = Array.from(this.legalNews.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (!category) {
      return news;
    }
    
    return news.filter(item => item.category === category);
  }
  
  async getFeaturedNews(): Promise<LegalNews[]> {
    return Array.from(this.legalNews.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }
  
  async getLegalNewsById(id: number): Promise<LegalNews | undefined> {
    return this.legalNews.get(id);
  }
  
  async createLegalNews(insertNews: InsertLegalNews): Promise<LegalNews> {
    const id = this.legalNewsId++;
    const news: LegalNews = { 
      ...insertNews, 
      id, 
      date: new Date() 
    };
    this.legalNews.set(id, news);
    return news;
  }
  
  // Experts methods
  async getLegalExperts(specialty?: string, location?: string): Promise<LegalExpert[]> {
    let experts = Array.from(this.legalExperts.values());
    
    if (specialty) {
      experts = experts.filter(expert => expert.specialty === specialty);
    }
    
    if (location) {
      experts = experts.filter(expert => expert.location === location);
    }
    
    return experts;
  }
  
  async getFeaturedExperts(): Promise<LegalExpert[]> {
    return Array.from(this.legalExperts.values())
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }
  
  async getLegalExpertById(id: number): Promise<LegalExpert | undefined> {
    return this.legalExperts.get(id);
  }
  
  async createLegalExpert(insertExpert: InsertLegalExpert): Promise<LegalExpert> {
    const id = this.legalExpertId++;
    const expert: LegalExpert = { 
      ...insertExpert, 
      id,
      rating: 0,
      reviewCount: 0
    };
    this.legalExperts.set(id, expert);
    return expert;
  }
  
  async getExpertSpecialties(): Promise<ExpertSpecialty[]> {
    return Array.from(this.expertSpecialties.values());
  }
  
  async getExpertLocations(): Promise<ExpertLocation[]> {
    return Array.from(this.expertLocations.values());
  }
  
  // Document methods
  async getUserDocument(id: number): Promise<UserDocument | undefined> {
    return this.userDocuments.get(id);
  }
  
  async saveUserDocument(insertDocument: InsertUserDocument): Promise<UserDocument> {
    const id = this.userDocumentId++;
    const document: UserDocument = { 
      ...insertDocument, 
      id, 
      uploadedAt: new Date(),
      analysisResult: null
    };
    this.userDocuments.set(id, document);
    return document;
  }
  
  async updateDocumentAnalysis(id: number, analysisResult: any): Promise<UserDocument> {
    const document = this.userDocuments.get(id);
    
    if (!document) {
      throw new Error(`Document with ID ${id} not found`);
    }
    
    const updatedDocument = {
      ...document,
      analysisResult
    };
    
    this.userDocuments.set(id, updatedDocument);
    return updatedDocument;
  }
  
  // AI Conversation methods
  async saveAiConversation(insertConversation: InsertAiConversation): Promise<AiConversation> {
    const id = this.aiConversationId++;
    const conversation: AiConversation = { 
      ...insertConversation, 
      id, 
      timestamp: new Date() 
    };
    this.aiConversations.set(id, conversation);
    return conversation;
  }
  
  async getUserConversations(userId: number): Promise<AiConversation[]> {
    return Array.from(this.aiConversations.values())
      .filter(conversation => conversation.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  // Quiz methods
  async getLegalQuizzes(category?: string): Promise<LegalQuiz[]> {
    const quizzes = Array.from(this.legalQuizzes.values());
    
    if (!category) {
      return quizzes;
    }
    
    return quizzes.filter(quiz => quiz.category === category);
  }
  
  async getLegalQuizById(id: number): Promise<LegalQuiz | undefined> {
    return this.legalQuizzes.get(id);
  }
  
  async getLegalQuizWithQuestions(id: number): Promise<(LegalQuiz & { questions: QuizQuestion[] }) | undefined> {
    const quiz = this.legalQuizzes.get(id);
    
    if (!quiz) {
      return undefined;
    }
    
    const questions = Array.from(this.quizQuestions.values())
      .filter(question => question.quizId === id);
    
    return {
      ...quiz,
      questions
    };
  }
  
  async createLegalQuiz(insertQuiz: InsertLegalQuiz): Promise<LegalQuiz> {
    const id = this.legalQuizId++;
    const quiz: LegalQuiz = { 
      ...insertQuiz, 
      id, 
      createdAt: new Date() 
    };
    this.legalQuizzes.set(id, quiz);
    return quiz;
  }
  
  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = this.quizQuestionId++;
    const question: QuizQuestion = { 
      ...insertQuestion, 
      id 
    };
    this.quizQuestions.set(id, question);
    return question;
  }
  
  async saveUserQuizAttempt(insertAttempt: InsertUserQuizAttempt): Promise<UserQuizAttempt> {
    const id = this.userQuizAttemptId++;
    const attempt: UserQuizAttempt = { 
      ...insertAttempt, 
      id, 
      completedAt: new Date() 
    };
    this.userQuizAttempts.set(id, attempt);
    return attempt;
  }
  
  // Initialize with sample data
  private initializeData() {
    // Add glossary categories
    const categories = [
      { value: "constitutional-law", label: "Constitutional Law", description: "Principles and rules forming the basis of a nation's legal system" },
      { value: "criminal-law", label: "Criminal Law", description: "Laws related to crimes and their punishments" },
      { value: "civil-law", label: "Civil Law", description: "Laws dealing with disputes between individuals or organizations" },
      { value: "property-law", label: "Property Law", description: "Laws governing ownership and use of property" },
      { value: "family-law", label: "Family Law", description: "Laws related to family relationships, marriage, divorce, etc." },
      { value: "corporate-law", label: "Corporate Law", description: "Laws governing companies and business entities" }
    ];
    
    categories.forEach(category => {
      const id = this.glossaryCategoryId++;
      this.glossaryCategories.set(id, { ...category, id });
    });
    
    // Add glossary terms
    const constitutionalCategory = Array.from(this.glossaryCategories.values()).find(c => c.value === "constitutional-law")!;
    
    const terms = [
      {
        term: "Constitution",
        definition: "The fundamental law of a nation or state which establishes the character and conception of its government, laying down the basic principles to which its internal life is to be conformed.",
        categoryId: constitutionalCategory.id,
        explanationHtml: "<p>A constitution is the supreme law that determines the relationship among people living in a territory and their government. It establishes the basic principles of the state, the structures and processes of government and the fundamental rights of citizens.</p>",
        references: "Indian Constitution, Article 1-395"
      },
      {
        term: "Fundamental Rights",
        definition: "Basic rights guaranteed to all citizens by the constitution that cannot be taken away by any law, executive action, or judicial order.",
        categoryId: constitutionalCategory.id,
        explanationHtml: "<p>In India, Fundamental Rights are enshrined in Part III of the Constitution. They include the right to equality, freedom, against exploitation, freedom of religion, cultural and educational rights, and constitutional remedies.</p>",
        references: "Indian Constitution, Part III, Articles 12-35"
      },
      {
        term: "Directive Principles",
        definition: "Guidelines for the government to be kept in mind while framing laws and policies. These principles are non-justiciable.",
        categoryId: constitutionalCategory.id,
        explanationHtml: "<p>Directive Principles of State Policy are guidelines for the framing of laws by the government. These provisions, set out in Part IV of the Constitution, are not enforceable by any court, but the principles laid down therein are fundamental in the governance of the country.</p>",
        references: "Indian Constitution, Part IV, Articles 36-51"
      },
      {
        term: "Writ",
        definition: "A written order issued by a court commanding the party to whom it is addressed to perform or cease performing a specified act.",
        categoryId: constitutionalCategory.id,
        explanationHtml: "<p>In Indian law, writs are orders issued by the Supreme Court or High Courts. The five types of writs are Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo Warranto.</p>",
        references: "Indian Constitution, Article 32 and 226"
      }
    ];
    
    terms.forEach(term => {
      const id = this.glossaryTermId++;
      this.glossaryTerms.set(id, { ...term, id, createdAt: new Date() });
    });
    
    // Add legal news
    const news = [
      {
        title: "Supreme Court Issues New Guidelines on Bail Applications",
        summary: "The Supreme Court has issued new guidelines for handling bail applications, emphasizing the need for prompt hearings and consideration of personal liberty...",
        content: "The Supreme Court of India has issued comprehensive guidelines for handling bail applications across all courts in the country. The guidelines emphasize that bail hearings should be conducted promptly and personal liberty should be given due consideration. The Court noted that prolonged incarceration without trial violates the fundamental right to liberty under Article 21 of the Constitution...",
        category: "Supreme Court",
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        source: "Legal Times",
        externalUrl: "#",
        date: new Date(2023, 5, 15) // June 15, 2023
      },
      {
        title: "Parliament Passes Digital Personal Data Protection Act",
        summary: "The landmark Digital Personal Data Protection legislation has been passed by both houses of Parliament, establishing a new framework for data privacy in India...",
        content: "In a significant legislative development, the Digital Personal Data Protection Bill has been passed by both houses of Parliament. This landmark legislation establishes a comprehensive framework for data privacy in India. The Act introduces strict regulations on the collection, processing, and storage of personal data by both government and private entities...",
        category: "Legislation",
        imageUrl: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        source: "Legal Chronicle",
        externalUrl: "#",
        date: new Date(2023, 5, 10) // June 10, 2023
      },
      {
        title: "Delhi High Court Rules on Right to Be Forgotten",
        summary: "In a significant judgment, the Delhi High Court has recognized the 'Right to be Forgotten' as an important facet of the right to privacy, directing search engines to remove certain personal information...",
        content: "The Delhi High Court has delivered a landmark judgment recognizing the 'Right to be Forgotten' as an integral aspect of the right to privacy under Article 21 of the Constitution. The court directed search engines to remove certain personal information of the petitioner from their search results. This decision marks a significant development in privacy law in India...",
        category: "High Court",
        imageUrl: "https://images.unsplash.com/photo-1453945619913-79ec89a82c51?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        source: "Law Journal",
        externalUrl: "#",
        date: new Date(2023, 5, 5) // June 5, 2023
      }
    ];
    
    news.forEach(item => {
      const id = this.legalNewsId++;
      this.legalNews.set(id, { ...item, id });
    });
    
    // Add expert specialties
    const specialties = [
      { value: "constitutional", label: "Constitutional Law" },
      { value: "criminal", label: "Criminal Law" },
      { value: "corporate", label: "Corporate Law" },
      { value: "family", label: "Family Law" },
      { value: "property", label: "Property Law" },
      { value: "tax", label: "Tax Law" }
    ];
    
    specialties.forEach(specialty => {
      const id = this.expertSpecialtyId++;
      this.expertSpecialties.set(id, { ...specialty, id });
    });
    
    // Add expert locations
    const locations = [
      { value: "delhi", label: "Delhi" },
      { value: "mumbai", label: "Mumbai" },
      { value: "bangalore", label: "Bangalore" },
      { value: "chennai", label: "Chennai" },
      { value: "kolkata", label: "Kolkata" },
      { value: "hyderabad", label: "Hyderabad" }
    ];
    
    locations.forEach(location => {
      const id = this.expertLocationId++;
      this.expertLocations.set(id, { ...location, id });
    });
    
    // Add legal experts
    const experts = [
      {
        name: "Rajiv Sharma",
        specialty: "Constitutional Law Expert",
        location: "New Delhi",
        experience: "15+ years experience",
        rating: 4.5,
        reviewCount: 48,
        courts: ["Supreme Court", "High Court"],
        initials: "RS",
        colorScheme: "lavender",
        bio: "Rajiv Sharma is a senior advocate specializing in constitutional law with extensive experience in Supreme Court litigation.",
        contactInfo: { email: "rajiv@example.com", phone: "+91-9876543210" }
      },
      {
        name: "Anjali Kumar",
        specialty: "Corporate Law Specialist",
        location: "Mumbai",
        experience: "10+ years experience",
        rating: 4.0,
        reviewCount: 36,
        courts: ["Mergers", "Startups"],
        initials: "AK",
        colorScheme: "mint",
        bio: "Anjali Kumar is a corporate lawyer specializing in mergers and acquisitions, startup law, and corporate governance.",
        contactInfo: { email: "anjali@example.com", phone: "+91-9876543211" }
      },
      {
        name: "Vikram Patel",
        specialty: "Criminal Law Expert",
        location: "Bangalore",
        experience: "12+ years experience",
        rating: 5.0,
        reviewCount: 52,
        courts: ["Trial", "Appeals"],
        initials: "VP",
        colorScheme: "lavender",
        bio: "Vikram Patel is a criminal defense attorney with expertise in both trial and appellate advocacy.",
        contactInfo: { email: "vikram@example.com", phone: "+91-9876543212" }
      }
    ];
    
    experts.forEach(expert => {
      const id = this.legalExpertId++;
      this.legalExperts.set(id, { ...expert, id });
    });
    
    // Add legal quizzes
    const quizzes = [
      {
        title: "Constitutional Law Basics",
        description: "Test your knowledge of Indian constitutional law fundamentals",
        category: "constitutional-law",
        difficulty: "beginner"
      },
      {
        title: "Criminal Procedure",
        description: "Test your understanding of criminal procedure in India",
        category: "criminal-law",
        difficulty: "intermediate"
      },
      {
        title: "Corporate Law Essentials",
        description: "Test your knowledge of company law and corporate governance",
        category: "corporate-law",
        difficulty: "intermediate"
      }
    ];
    
    quizzes.forEach(quiz => {
      const id = this.legalQuizId++;
      this.legalQuizzes.set(id, { ...quiz, id, createdAt: new Date() });
    });
    
    // Add quiz questions
    const constitutionalQuiz = Array.from(this.legalQuizzes.values()).find(q => q.category === "constitutional-law")!;
    
    const questions = [
      {
        quizId: constitutionalQuiz.id,
        question: "Which article of the Indian Constitution abolishes untouchability?",
        options: ["Article 14", "Article 15", "Article 17", "Article 21"],
        correctOption: 2,
        explanation: "Article 17 of the Indian Constitution abolishes untouchability and forbids its practice in any form."
      },
      {
        quizId: constitutionalQuiz.id,
        question: "Who is known as the Father of the Indian Constitution?",
        options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Dr. B.R. Ambedkar", "Sardar Vallabhbhai Patel"],
        correctOption: 2,
        explanation: "Dr. B.R. Ambedkar is known as the Father of the Indian Constitution. He was the Chairman of the Drafting Committee."
      },
      {
        quizId: constitutionalQuiz.id,
        question: "When did the Indian Constitution come into effect?",
        options: ["15 August 1947", "26 January 1950", "2 October 1948", "30 January 1948"],
        correctOption: 1,
        explanation: "The Constitution of India came into effect on 26 January 1950, which is celebrated as Republic Day in India."
      }
    ];
    
    questions.forEach(question => {
      const id = this.quizQuestionId++;
      this.quizQuestions.set(id, { ...question, id });
    });
  }
}

export const storage = new MemStorage();

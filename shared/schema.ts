import { pgTable, text, serial, integer, boolean, json, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
});

// Glossary Categories
export const glossaryCategories = pgTable("glossary_categories", {
  id: serial("id").primaryKey(),
  value: text("value").notNull().unique(),
  label: text("label").notNull(),
  description: text("description"),
});

export const insertGlossaryCategorySchema = createInsertSchema(glossaryCategories).pick({
  value: true,
  label: true,
  description: true,
});

// Glossary Terms
export const glossaryTerms = pgTable("glossary_terms", {
  id: serial("id").primaryKey(),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
  categoryId: integer("category_id").references(() => glossaryCategories.id),
  explanationHtml: text("explanation_html"),
  references: text("references"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGlossaryTermSchema = createInsertSchema(glossaryTerms).pick({
  term: true,
  definition: true,
  categoryId: true,
  explanationHtml: true,
  references: true,
});

// Legal News
export const legalNews = pgTable("legal_news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  source: text("source"),
  externalUrl: text("external_url"),
  date: timestamp("date").defaultNow(),
});

export const insertLegalNewsSchema = createInsertSchema(legalNews).pick({
  title: true,
  summary: true,
  content: true,
  category: true,
  imageUrl: true,
  source: true,
  externalUrl: true,
});

// Legal Experts
export const legalExperts = pgTable("legal_experts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  location: text("location").notNull(),
  experience: text("experience").notNull(),
  rating: integer("rating").default(0),
  reviewCount: integer("review_count").default(0),
  courts: text("courts").array(),
  initials: text("initials"),
  colorScheme: text("color_scheme"),
  bio: text("bio"),
  contactInfo: json("contact_info"),
});

export const insertLegalExpertSchema = createInsertSchema(legalExperts).pick({
  name: true,
  specialty: true,
  location: true,
  experience: true,
  courts: true,
  initials: true,
  colorScheme: true,
  bio: true,
  contactInfo: true,
});

// User Documents
export const userDocuments = pgTable("user_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  content: text("content"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  analysisResult: json("analysis_result"),
});

export const insertUserDocumentSchema = createInsertSchema(userDocuments).pick({
  userId: true,
  fileName: true,
  fileType: true,
  fileSize: true,
  content: true,
});

// AI Conversations
export const aiConversations = pgTable("ai_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  query: text("query").notNull(),
  response: text("response").notNull(),
  citations: text("citations"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertAiConversationSchema = createInsertSchema(aiConversations).pick({
  userId: true,
  query: true,
  response: true,
  citations: true,
});

// Legal Quizzes
export const legalQuizzes = pgTable("legal_quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLegalQuizSchema = createInsertSchema(legalQuizzes).pick({
  title: true,
  description: true,
  category: true,
  difficulty: true,
});

// Quiz Questions
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => legalQuizzes.id),
  question: text("question").notNull(),
  options: text("options").array(),
  correctOption: integer("correct_option").notNull(),
  explanation: text("explanation"),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).pick({
  quizId: true,
  question: true,
  options: true,
  correctOption: true,
  explanation: true,
});

// User Quiz Attempts
export const userQuizAttempts = pgTable("user_quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  quizId: integer("quiz_id").references(() => legalQuizzes.id),
  score: integer("score").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
  answers: json("answers"),
});

export const insertUserQuizAttemptSchema = createInsertSchema(userQuizAttempts).pick({
  userId: true,
  quizId: true,
  score: true,
  answers: true,
});

// Specialties (for expert directory)
export const expertSpecialties = pgTable("expert_specialties", {
  id: serial("id").primaryKey(),
  value: text("value").notNull().unique(),
  label: text("label").notNull(),
});

export const insertExpertSpecialtySchema = createInsertSchema(expertSpecialties).pick({
  value: true,
  label: true,
});

// Locations (for expert directory)
export const expertLocations = pgTable("expert_locations", {
  id: serial("id").primaryKey(),
  value: text("value").notNull().unique(),
  label: text("label").notNull(),
});

export const insertExpertLocationSchema = createInsertSchema(expertLocations).pick({
  value: true,
  label: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGlossaryCategory = z.infer<typeof insertGlossaryCategorySchema>;
export type GlossaryCategory = typeof glossaryCategories.$inferSelect;

export type InsertGlossaryTerm = z.infer<typeof insertGlossaryTermSchema>;
export type GlossaryTerm = typeof glossaryTerms.$inferSelect;

export type InsertLegalNews = z.infer<typeof insertLegalNewsSchema>;
export type LegalNews = typeof legalNews.$inferSelect;

export type InsertLegalExpert = z.infer<typeof insertLegalExpertSchema>;
export type LegalExpert = typeof legalExperts.$inferSelect;

export type InsertUserDocument = z.infer<typeof insertUserDocumentSchema>;
export type UserDocument = typeof userDocuments.$inferSelect;

export type InsertAiConversation = z.infer<typeof insertAiConversationSchema>;
export type AiConversation = typeof aiConversations.$inferSelect;

export type InsertLegalQuiz = z.infer<typeof insertLegalQuizSchema>;
export type LegalQuiz = typeof legalQuizzes.$inferSelect;

export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;

export type InsertUserQuizAttempt = z.infer<typeof insertUserQuizAttemptSchema>;
export type UserQuizAttempt = typeof userQuizAttempts.$inferSelect;

export type InsertExpertSpecialty = z.infer<typeof insertExpertSpecialtySchema>;
export type ExpertSpecialty = typeof expertSpecialties.$inferSelect;

export type InsertExpertLocation = z.infer<typeof insertExpertLocationSchema>;
export type ExpertLocation = typeof expertLocations.$inferSelect;

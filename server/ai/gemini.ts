import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export class GeminiAI {
  private model: any;
  private generationConfig: any;
  private safetySettings: any;

  constructor() {
    // Initialize with a mock API key since we'll use local processing
    // In a real application, this would come from environment variables
    const apiKey = process.env.GEMINI_API_KEY || "mock-api-key-for-local-processing";
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      this.model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "You are JusticeAI, a legal assistant specializing in Indian law. Provide accurate, helpful, and concise information with citations to relevant laws, acts, or precedents where appropriate. You are not a substitute for professional legal advice, and you should make this clear in your responses when necessary."
      });
      
      this.generationConfig = {
        temperature: 0.4,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 1024,
      };
      
      this.safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];
    } catch (error) {
      console.error("Failed to initialize Gemini AI model:", error);
      // Create a fallback local implementation
      this.model = null;
    }
  }

  async generateResponse(query: string): Promise<{ response: string, citations: string }> {
    try {
      if (!this.model) {
        return this.generateLocalResponse(query);
      }
      
      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: query }] }],
        generationConfig: this.generationConfig,
        safetySettings: this.safetySettings,
      });

      const response = result.response;
      const text = response.text();
      
      // Extract citations if they exist
      const citationMatch = text.match(/Based on (.*?)\.$/);
      const citations = citationMatch ? citationMatch[1] : "";
      
      // Remove the citation from the main response if it's at the end
      const cleanedResponse = citationMatch ? text.replace(/Based on (.*?)\.$/g, "") : text;
      
      return {
        response: cleanedResponse.trim(),
        citations: citations
      };
    } catch (error) {
      console.error("Error generating AI response:", error);
      return this.generateLocalResponse(query);
    }
  }

  async analyzeDocument(content: string): Promise<any> {
    try {
      if (!this.model) {
        return this.generateLocalDocumentAnalysis(content);
      }
      
      const result = await this.model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Please analyze this legal document and provide a structured analysis with the following sections: 
                1. Summary (brief overview of the document)
                2. Document Type
                3. Key Information (extract key details)
                4. Potential Risks (identify concerning clauses or provisions)
                5. Compliance Checks (assess if it complies with relevant laws)
                
                Document content: 
                ${content.substring(0, 30000)} // Limit to avoid token limits
                `
              }
            ]
          }
        ],
        generationConfig: {
          ...this.generationConfig,
          maxOutputTokens: 2048, // Increase for document analysis
        },
        safetySettings: this.safetySettings,
      });

      const response = result.response;
      const text = response.text();
      
      // Parse the response into structured data
      return this.parseDocumentAnalysis(text);
    } catch (error) {
      console.error("Error analyzing document:", error);
      return this.generateLocalDocumentAnalysis(content);
    }
  }

  private async generateLocalResponse(query: string): Promise<{ response: string, citations: string }> {
    // This is a fallback method for when the Gemini API is not available
    // In a production system, you would implement a more sophisticated local model
    
    // Basic query matching for some common questions
    let response = "I'm sorry, I can't provide a specific answer to that question at the moment.";
    let citations = "";
    
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("file a consumer complaint") || lowerQuery.includes("consumer complaint procedure")) {
      response = "To file a consumer complaint in India, follow these steps:\n\n1. Submit a written complaint to the business first.\n2. If unresolved, file at the appropriate Consumer Dispute Redressal Commission based on the claim amount.\n3. Include all relevant documents, payment details, and proof of communication with the business.\n4. Pay the prescribed fee based on the compensation claimed.\n5. You can file in person or electronically through the official portal.";
      citations = "Consumer Protection Act, 2019 and Consumer Protection Rules, 2020";
    } 
    else if (lowerQuery.includes("right to information") || lowerQuery.includes("rti application")) {
      response = "To file an RTI application in India:\n\n1. Prepare your application with specific questions about information you seek.\n2. Address it to the Public Information Officer (PIO) of the relevant government department.\n3. Pay the application fee (₹10 for general category).\n4. Submit in person, by post, or online through the RTI portal.\n5. You should receive a response within 30 days.";
      citations = "Right to Information Act, 2005";
    }
    else if (lowerQuery.includes("fundamental rights") || lowerQuery.includes("basic rights")) {
      response = "The Fundamental Rights guaranteed by the Indian Constitution include:\n\n1. Right to Equality (Articles 14-18)\n2. Right to Freedom (Articles 19-22)\n3. Right against Exploitation (Articles 23-24)\n4. Right to Freedom of Religion (Articles 25-28)\n5. Cultural and Educational Rights (Articles 29-30)\n6. Right to Constitutional Remedies (Article 32)";
      citations = "Part III of the Indian Constitution (Articles 12-35)";
    }
    
    return { response, citations };
  }

  private generateLocalDocumentAnalysis(content: string): any {
    // Sample document analysis when API is not available
    // This would be replaced with a sophisticated local model in a production system
    
    // Extract document type based on simple pattern matching
    let documentType = "Legal Document";
    if (content.toLowerCase().includes("agreement") || content.toLowerCase().includes("contract")) {
      documentType = "Contract/Agreement";
    } else if (content.toLowerCase().includes("affidavit")) {
      documentType = "Affidavit";
    } else if (content.toLowerCase().includes("notice")) {
      documentType = "Legal Notice";
    }
    
    // Generate a basic analysis
    return {
      summary: "This appears to be a " + documentType.toLowerCase() + " that outlines various terms and conditions between parties. Please review carefully with a qualified legal professional.",
      documentType: documentType,
      analysisTime: 0.5,
      pageCount: Math.ceil(content.length / 3000), // Rough page count estimation
      
      keyInformation: [
        {
          title: "Document Overview",
          content: "This document contains approximately " + content.length + " characters and requires professional review for full analysis."
        },
        {
          title: "Key Terms",
          content: "The document appears to contain several legal terms and clauses that should be reviewed carefully."
        }
      ],
      
      potentialRisks: [
        {
          title: "General Legal Risk",
          description: "This is an automated analysis and may not identify all legal risks. Please consult a qualified legal professional.",
          severity: "medium"
        }
      ],
      
      complianceChecks: [
        {
          requirement: "Professional Review",
          compliant: false,
          details: "This document requires professional legal review to ensure compliance with applicable laws."
        },
        {
          requirement: "Digital Signature",
          compliant: !content.includes("digital signature") && !content.includes("e-sign"),
          details: "The document may require proper digital signatures to be legally valid."
        }
      ]
    };
  }

  private parseDocumentAnalysis(text: string): any {
    // This method would parse the AI-generated text into structured data
    // In a real implementation, this would use more sophisticated NLP techniques
    
    // For now, we'll use a simple approach to extract sections
    const sections = {
      summary: this.extractSection(text, "Summary", ["Document Type", "Key Information"]),
      documentType: this.extractSimpleValue(text, "Document Type", ["Key Information"]),
      keyInformation: [],
      potentialRisks: [],
      complianceChecks: []
    };
    
    // Extract Key Information section
    const keyInfoSection = this.extractSection(text, "Key Information", ["Potential Risks"]);
    if (keyInfoSection) {
      // Break into bullet points or paragraphs
      const keyPoints = keyInfoSection.split(/\n\d+\.|\n-/).filter(Boolean);
      sections.keyInformation = keyPoints.map(point => ({
        title: point.split(':')[0] || "Information Point",
        content: point.split(':').slice(1).join(':').trim() || point.trim()
      }));
    }
    
    // Extract Potential Risks section
    const risksSection = this.extractSection(text, "Potential Risks", ["Compliance Checks"]);
    if (risksSection) {
      const risks = risksSection.split(/\n\d+\.|\n-/).filter(Boolean);
      sections.potentialRisks = risks.map(risk => {
        // Try to determine severity based on language
        let severity = "medium";
        if (risk.toLowerCase().includes("critical") || risk.toLowerCase().includes("severe") || 
            risk.toLowerCase().includes("high risk") || risk.toLowerCase().includes("serious")) {
          severity = "high";
        } else if (risk.toLowerCase().includes("minor") || risk.toLowerCase().includes("low risk")) {
          severity = "low";
        }
        
        return {
          title: risk.split(':')[0] || "Risk Factor",
          description: risk.split(':').slice(1).join(':').trim() || risk.trim(),
          severity
        };
      });
    }
    
    // Extract Compliance Checks section
    const complianceSection = this.extractSection(text, "Compliance Checks", []);
    if (complianceSection) {
      const checks = complianceSection.split(/\n\d+\.|\n-/).filter(Boolean);
      sections.complianceChecks = checks.map(check => {
        // Determine compliance based on language
        const compliant = !(check.toLowerCase().includes("non-compliant") || 
                          check.toLowerCase().includes("not compliant") ||
                          check.toLowerCase().includes("fails to comply") ||
                          check.toLowerCase().includes("violation"));
        
        return {
          requirement: check.split(':')[0] || "Compliance Requirement",
          compliant,
          details: check.split(':').slice(1).join(':').trim() || check.trim()
        };
      });
    }
    
    // Add metadata
    return {
      ...sections,
      analysisTime: 2.5, // Mock analysis time
      pageCount: 3 // Mock page count
    };
  }

  private extractSection(text: string, sectionName: string, nextSections: string[]): string {
    const regex = new RegExp(`${sectionName}[:\\s]*(.*?)${nextSections.length > 0 ? `(?=${nextSections.join('|')})` : '$'}`, 'is');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  private extractSimpleValue(text: string, sectionName: string, nextSections: string[]): string {
    const sectionText = this.extractSection(text, sectionName, nextSections);
    // Just get the first line as a simple value
    return sectionText.split('\n')[0].trim();
  }
}

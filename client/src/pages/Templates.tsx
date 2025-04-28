import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

// Template types definition
type TemplateField = {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  options?: {value: string, label: string}[];
  required?: boolean;
};

type Template = {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  fields: TemplateField[];
  template: string;
};

// Mock data for templates
const legalTemplates: Template[] = [
  {
    id: "affidavit",
    title: "General Affidavit",
    category: "personal",
    description: "A general-purpose affidavit for making a formal sworn statement.",
    icon: "ri-file-text-line",
    fields: [
      { id: "name", label: "Your Full Name", type: "text", placeholder: "John Doe", required: true },
      { id: "address", label: "Your Address", type: "text", placeholder: "123 Main St, City, State", required: true },
      { id: "statement", label: "Statement of Facts", type: "textarea", placeholder: "I, the undersigned, do hereby state the following facts...", required: true },
      { id: "date", label: "Date", type: "text", placeholder: "DD/MM/YYYY", required: true },
    ],
    template: `AFFIDAVIT

I, {{name}}, residing at {{address}}, do solemnly affirm and declare as follows:

{{statement}}

I make this solemn declaration conscientiously believing the same to be true and by virtue of the Oaths Act.

Sworn at ________________
This ____ day of ________, 20__

________________________
(Signature of Deponent)

Before me,
________________________
(Signature of Notary/Authority)
`
  },
  {
    id: "poa",
    title: "Power of Attorney",
    category: "personal",
    description: "Authorize someone to act on your behalf for legal or financial matters.",
    icon: "ri-file-user-line",
    fields: [
      { id: "principalName", label: "Your Full Name (Principal)", type: "text", placeholder: "John Doe", required: true },
      { id: "principalAddress", label: "Your Address", type: "text", placeholder: "123 Main St, City, State", required: true },
      { id: "attorneyName", label: "Attorney's Full Name", type: "text", placeholder: "Jane Smith", required: true },
      { id: "attorneyAddress", label: "Attorney's Address", type: "text", placeholder: "456 Oak St, City, State", required: true },
      { id: "powers", label: "Powers Granted", type: "select", options: [
        {value: "general", label: "General Power of Attorney (All matters)"},
        {value: "financial", label: "Financial Matters Only"},
        {value: "medical", label: "Medical Decisions Only"},
        {value: "specific", label: "Specific Transaction"}
      ], required: true },
      { id: "specificPowers", label: "Specific Powers (if applicable)", type: "textarea", placeholder: "Describe specific powers being granted..." },
      { id: "duration", label: "Duration", type: "select", options: [
        {value: "indefinite", label: "Until Revoked"},
        {value: "specific", label: "Specific Time Period"},
        {value: "event", label: "Until Specific Event"}
      ], required: true },
      { id: "specificDuration", label: "Specific Duration Details (if applicable)", type: "text", placeholder: "e.g., '3 months' or 'until I return from abroad'" },
    ],
    template: `POWER OF ATTORNEY

KNOW ALL MEN BY THESE PRESENTS:

I, {{principalName}}, of {{principalAddress}}, do hereby appoint {{attorneyName}}, of {{attorneyAddress}}, as my true and lawful Attorney to act for me and in my name, place, and stead, and for my use and benefit with respect to the following:

POWERS GRANTED: {{#if powers == "general"}}
To do and perform all acts and things that I could do through my own act and deed, including but not limited to financial transactions, property matters, legal proceedings, and personal affairs.
{{/if}}{{#if powers == "financial"}}
To conduct and transact all my financial affairs, including but not limited to banking operations, investments, tax matters, and property transactions.
{{/if}}{{#if powers == "medical"}}
To make medical and healthcare decisions on my behalf, including but not limited to consenting to or refusing medical treatment, and accessing my medical records.
{{/if}}{{#if powers == "specific"}}
To conduct only the following specific transactions or duties:
{{specificPowers}}
{{/if}}

DURATION: {{#if duration == "indefinite"}}
This Power of Attorney shall remain in effect until revoked by me in writing.
{{/if}}{{#if duration == "specific"}}
This Power of Attorney shall remain in effect for the following time period: {{specificDuration}}.
{{/if}}{{#if duration == "event"}}
This Power of Attorney shall remain in effect until the following event occurs: {{specificDuration}}.
{{/if}}

IN WITNESS WHEREOF, I have hereunto set my hand this ___ day of __________, 20___.

________________________
{{principalName}} (Principal)

WITNESS:
________________________
(Signature of Witness)
Name: ___________________
Address: ________________

ATTESTATION:
Subscribed and sworn to before me on this ___ day of __________, 20___.

________________________
Notary Public
My commission expires: _____________
`
  },
  {
    id: "rental",
    title: "Rental Agreement",
    category: "property",
    description: "Standard residential property rental/lease agreement.",
    icon: "ri-home-4-line",
    fields: [
      { id: "landlordName", label: "Landlord's Full Name", type: "text", placeholder: "John Doe", required: true },
      { id: "landlordAddress", label: "Landlord's Address", type: "text", placeholder: "123 Main St, City, State", required: true },
      { id: "tenantName", label: "Tenant's Full Name", type: "text", placeholder: "Jane Smith", required: true },
      { id: "tenantAddress", label: "Tenant's Current Address", type: "text", placeholder: "456 Oak St, City, State", required: true },
      { id: "propertyAddress", label: "Rental Property Address", type: "text", placeholder: "789 Pine St, City, State", required: true },
      { id: "term", label: "Lease Term", type: "select", options: [
        {value: "month", label: "Month-to-Month"},
        {value: "fixed", label: "Fixed Term"},
      ], required: true },
      { id: "fixedTerm", label: "Fixed Term Duration (if applicable)", type: "text", placeholder: "12 months" },
      { id: "startDate", label: "Start Date", type: "text", placeholder: "DD/MM/YYYY", required: true },
      { id: "endDate", label: "End Date (if fixed term)", type: "text", placeholder: "DD/MM/YYYY" },
      { id: "rent", label: "Monthly Rent Amount", type: "text", placeholder: "₹10,000", required: true },
      { id: "deposit", label: "Security Deposit Amount", type: "text", placeholder: "₹20,000", required: true },
      { id: "utilities", label: "Utilities Included", type: "select", options: [
        {value: "none", label: "None (Tenant pays all)"},
        {value: "water", label: "Water Only"},
        {value: "electric", label: "Electricity Only"},
        {value: "both", label: "Water & Electricity"},
        {value: "all", label: "All Utilities Included"},
      ], required: true },
    ],
    template: `RESIDENTIAL RENTAL AGREEMENT

THIS RENTAL AGREEMENT (the "Agreement") is made on __________, 20___
BETWEEN:
{{landlordName}} (the "Landlord") of {{landlordAddress}}
AND
{{tenantName}} (the "Tenant") of {{tenantAddress}}

1. PREMISES
   The Landlord rents to the Tenant and the Tenant rents from the Landlord, for residential purposes only, the premises located at: {{propertyAddress}} (the "Premises").

2. TERM
   {{#if term == "month"}}This Agreement establishes a month-to-month tenancy beginning on {{startDate}}.{{/if}}
   {{#if term == "fixed"}}This Agreement establishes a fixed-term tenancy of {{fixedTerm}} beginning on {{startDate}} and ending on {{endDate}}.{{/if}}

3. RENT
   The Tenant shall pay rent in the amount of {{rent}} per month, due on the 1st day of each month. 
   
4. SECURITY DEPOSIT
   The Tenant shall pay a security deposit of {{deposit}} to be held during the term of this Agreement.

5. UTILITIES
   {{#if utilities == "none"}}All utilities shall be the responsibility of the Tenant.{{/if}}
   {{#if utilities == "water"}}The Landlord shall pay for water. All other utilities shall be the responsibility of the Tenant.{{/if}}
   {{#if utilities == "electric"}}The Landlord shall pay for electricity. All other utilities shall be the responsibility of the Tenant.{{/if}}
   {{#if utilities == "both"}}The Landlord shall pay for water and electricity. All other utilities shall be the responsibility of the Tenant.{{/if}}
   {{#if utilities == "all"}}The Landlord shall pay for all utilities.{{/if}}

6. USE OF PREMISES
   The Premises shall be used only as a private residence for the Tenant(s) named above.

7. MAINTENANCE
   The Tenant shall maintain the Premises in a clean and sanitary condition and shall not damage or misuse the Premises.

8. TERMINATION
   {{#if term == "month"}}Either party may terminate this month-to-month tenancy by giving at least 30 days' written notice to the other party.{{/if}}
   {{#if term == "fixed"}}This fixed-term lease will expire on the end date specified unless renewed or extended by mutual written agreement.{{/if}}

IN WITNESS WHEREOF, the parties have executed this Agreement on the date first above written.

________________________    ________________________
Landlord                     Tenant
`
  },
  {
    id: "will",
    title: "Simple Will",
    category: "personal",
    description: "Basic last will and testament for distributing personal property.",
    icon: "ri-draft-line",
    fields: [
      { id: "testatorName", label: "Your Full Name", type: "text", placeholder: "John Doe", required: true },
      { id: "testatorAddress", label: "Your Address", type: "text", placeholder: "123 Main St, City, State", required: true },
      { id: "maritalStatus", label: "Marital Status", type: "select", options: [
        {value: "single", label: "Single"},
        {value: "married", label: "Married"},
        {value: "divorced", label: "Divorced"},
        {value: "widowed", label: "Widowed"},
      ], required: true },
      { id: "spouseName", label: "Spouse's Name (if married)", type: "text", placeholder: "Jane Doe" },
      { id: "executorName", label: "Executor's Full Name", type: "text", placeholder: "Jane Smith", required: true },
      { id: "executorAddress", label: "Executor's Address", type: "text", placeholder: "456 Oak St, City, State", required: true },
      { id: "alternateExecutorName", label: "Alternate Executor's Name", type: "text", placeholder: "Bob Johnson" },
      { id: "alternateExecutorAddress", label: "Alternate Executor's Address", type: "text", placeholder: "789 Pine St, City, State" },
      { id: "children", label: "Names of Children (if any, separated by commas)", type: "text", placeholder: "John Jr., Mary, David" },
      { id: "specificBequests", label: "Specific Bequests", type: "textarea", placeholder: "I give my gold watch to my son, John Jr..." },
      { id: "residualBeneficiary", label: "Residual Beneficiary", type: "text", placeholder: "My wife, Jane Doe", required: true },
    ],
    template: `LAST WILL AND TESTAMENT OF {{testatorName}}

I, {{testatorName}}, of {{testatorAddress}}, being of sound mind and memory, do hereby make, publish, and declare this to be my Last Will and Testament, hereby revoking all previous wills and codicils made by me.

1. DECLARATION
   I am {{#if maritalStatus == "married"}}married to {{spouseName}}{{else}}{{maritalStatus}}{{/if}}{{#if children}}, and I have the following children: {{children}}{{/if}}.

2. EXECUTOR
   I appoint {{executorName}}, residing at {{executorAddress}}, as the Executor of this my Last Will and Testament.
   {{#if alternateExecutorName}}If {{executorName}} is unable or unwilling to serve, then I appoint {{alternateExecutorName}}, residing at {{alternateExecutorAddress}}, as alternate Executor.{{/if}}

3. SPECIFIC BEQUESTS
   {{#if specificBequests}}{{specificBequests}}{{else}}I make no specific bequests.{{/if}}

4. RESIDUAL ESTATE
   I give, devise, and bequeath all the rest, residue, and remainder of my estate, whether real, personal, or mixed, wheresoever situated, to {{residualBeneficiary}}.

5. GUARDIAN (IF APPLICABLE)
   {{#if children}}In the event that at the time of my death I am the sole parent of minor children, I appoint {{executorName}} as guardian of the person and property of such minor children.{{/if}}

IN WITNESS WHEREOF, I, {{testatorName}}, the Testator, sign my name to this instrument this ____ day of __________, 20___, and being first duly sworn, do hereby declare to the undersigned authority that I sign and execute this instrument as my last will and that I sign it willingly, and that I execute it as my free and voluntary act for the purposes expressed in it, and that I am eighteen years of age or older, of sound mind, and under no constraint or undue influence.

________________________
{{testatorName}}, Testator

We, the undersigned witnesses, sign our names to this instrument, being first duly sworn, and do hereby declare to the undersigned authority that the Testator signs and executes this instrument as his/her last will and that he/she signs it willingly, and that each of us, in the presence and hearing of the Testator, hereby signs this will as witness to the Testator's signing, and that to the best of our knowledge the Testator is eighteen years of age or older, of sound mind, and under no constraint or undue influence.

________________________    ________________________
Witness                       Witness
Address: _______________    Address: _______________
`
  },
  {
    id: "employment",
    title: "Employment Contract",
    category: "business",
    description: "Standard employment agreement between employer and employee.",
    icon: "ri-user-received-line",
    fields: [
      { id: "employerName", label: "Employer's Name", type: "text", placeholder: "ABC Company Ltd.", required: true },
      { id: "employerAddress", label: "Employer's Address", type: "text", placeholder: "123 Business Park, City, State", required: true },
      { id: "employeeName", label: "Employee's Full Name", type: "text", placeholder: "John Doe", required: true },
      { id: "employeeAddress", label: "Employee's Address", type: "text", placeholder: "456 Oak St, City, State", required: true },
      { id: "position", label: "Job Position/Title", type: "text", placeholder: "Marketing Manager", required: true },
      { id: "startDate", label: "Employment Start Date", type: "text", placeholder: "DD/MM/YYYY", required: true },
      { id: "employmentType", label: "Employment Type", type: "select", options: [
        {value: "fulltime", label: "Full-time"},
        {value: "parttime", label: "Part-time"},
        {value: "contract", label: "Contract-based"},
        {value: "probation", label: "Probationary"},
      ], required: true },
      { id: "salary", label: "Monthly Salary/Compensation", type: "text", placeholder: "₹50,000", required: true },
      { id: "workHours", label: "Working Hours", type: "text", placeholder: "9:00 AM to 6:00 PM, Monday to Friday", required: true },
      { id: "duties", label: "Job Duties and Responsibilities", type: "textarea", placeholder: "List main duties and responsibilities...", required: true },
      { id: "benefits", label: "Benefits", type: "textarea", placeholder: "Health insurance, paid leave, etc." },
      { id: "noticePeriod", label: "Notice Period", type: "text", placeholder: "30 days", required: true },
    ],
    template: `EMPLOYMENT AGREEMENT

THIS EMPLOYMENT AGREEMENT (the "Agreement") is made and entered into on this ____ day of __________, 20___, by and between:

{{employerName}} (the "Employer"), having its principal place of business at {{employerAddress}}

AND

{{employeeName}} (the "Employee"), residing at {{employeeAddress}}.

1. POSITION AND DUTIES
   The Employer hereby employs the Employee in the position of {{position}}. The Employee's duties shall include, but are not limited to:
   
   {{duties}}
   
   The Employee agrees to perform such duties to the best of their ability and to act in the best interests of the Employer at all times.

2. TERM OF EMPLOYMENT
   The Employee's employment shall commence on {{startDate}} and shall continue until terminated in accordance with this Agreement.

3. EMPLOYMENT TYPE
   This is a {{employmentType}} position.

4. COMPENSATION
   The Employer shall pay the Employee a monthly salary of {{salary}}, subject to applicable tax and statutory deductions.

5. WORKING HOURS
   The Employee's regular working hours shall be {{workHours}}.

6. BENEFITS
   {{#if benefits}}The Employee shall be entitled to the following benefits:
   
   {{benefits}}{{else}}The Employee shall be entitled to benefits in accordance with the Employer's policies.{{/if}}

7. TERMINATION
   Either party may terminate this Agreement by providing {{noticePeriod}} written notice to the other party.

8. GOVERNING LAW
   This Agreement shall be governed by and construed in accordance with the laws of India.

IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.

________________________    ________________________
Employer                     Employee
{{employerName}}             {{employeeName}}
`
  }
];

// Common legal terms translations (English → Telugu/Hindi)
const legalTerms: Record<string, Record<string, string>> = {
  'hi': {
    'AFFIDAVIT': 'शपथ पत्र',
    'POWER OF ATTORNEY': 'मुख्तारनामा',
    'RENTAL AGREEMENT': 'किराया समझौता',
    'LAST WILL AND TESTAMENT': 'अंतिम इच्छा और वसीयत',
    'WITNESS': 'गवाह',
    'LANDLORD': 'मकान मालिक',
    'TENANT': 'किरायेदार',
    'EXECUTOR': 'निष्पादक',
    'PREMISES': 'परिसर',
    'NOTARY PUBLIC': 'नोटरी पब्लिक',
    'SIGNED': 'हस्ताक्षरित',
    'DECLARATION': 'घोषणा',
    'IN WITNESS WHEREOF': 'इसकी गवाही में',
    'RESIDENCE': 'निवास स्थान',
    'TERM': 'अवधि',
    'RENT': 'किराया',
    'SECURITY DEPOSIT': 'सुरक्षा जमा',
    'UTILITIES': 'उपयोगिताएँ',
    'MAINTENANCE': 'रखरखाव',
    'TERMINATION': 'समाप्ति'
  },
  'te': {
    'AFFIDAVIT': 'ప్రమాణ పత్రం',
    'POWER OF ATTORNEY': 'పవర్ ఆఫ్ అటార్నీ',
    'RENTAL AGREEMENT': 'అద్దె ఒప్పందం',
    'LAST WILL AND TESTAMENT': 'చివరి వీలు మరియు వీలునామా',
    'WITNESS': 'సాక్షి',
    'LANDLORD': 'ఇంటి యజమాని',
    'TENANT': 'అద్దెదారు',
    'EXECUTOR': 'ఎగ్జిక్యూటర్',
    'PREMISES': 'ఆవరణ',
    'NOTARY PUBLIC': 'నోటరీ పబ్లిక్',
    'SIGNED': 'సంతకం చేయబడింది',
    'DECLARATION': 'ప్రకటన',
    'IN WITNESS WHEREOF': 'దీనికి సాక్షిగా',
    'RESIDENCE': 'నివాసం',
    'TERM': 'కాలవ్యవధి',
    'RENT': 'అద్దె',
    'SECURITY DEPOSIT': 'భద్రతా డిపాజిట్',
    'UTILITIES': 'ఉపయోగిటీలు',
    'MAINTENANCE': 'నిర్వహణ',
    'TERMINATION': 'ముగింపు'
  }
};

// Render helper for preview
function renderTemplate(template: string, values: Record<string, string>): string {
  let rendered = template;
  
  // Simple templating system
  Object.keys(values).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, values[key] || '');
    
    // Handle conditionals (very basic implementation)
    const conditionalRegex = new RegExp(`{{#if ${key} == "([^"]+)"}}([\\s\\S]*?){{/if}}`, 'g');
    rendered = rendered.replace(conditionalRegex, (match, value, content) => {
      return values[key] === value ? content : '';
    });
  });
  
  // Clean up any remaining template tags
  rendered = rendered.replace(/{{#if .*?}}[\s\S]*?{{\/if}}/g, '');
  rendered = rendered.replace(/{{[^}]*}}/g, '');
  
  return rendered;
}

const TemplatesPage = () => {
  const { t, i18n } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [currentTab, setCurrentTab] = useState<string>('form');
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(legalTemplates);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Handle template selection
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setFormValues({});
    setCurrentTab('form');
  };
  
  // Handle form input change
  const handleInputChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };
  
  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    if (category === 'all') {
      setFilteredTemplates(legalTemplates);
    } else {
      setFilteredTemplates(legalTemplates.filter(template => template.category === category));
    }
  };
  
  // Generate document
  const generateDocument = () => {
    setCurrentTab('preview');
  };
  
  // Render and translate template content
  const renderAndTranslateTemplate = (template: string, values: Record<string, string>): string => {
    let rendered = renderTemplate(template, values);
    const currentLanguage = i18n.language;
    
    // Apply translations for non-English languages
    if (currentLanguage === 'te' || currentLanguage === 'hi') {
      if (legalTerms[currentLanguage]) {
        Object.keys(legalTerms[currentLanguage]).forEach(term => {
          const regex = new RegExp(`\\b${term}\\b`, 'gi');
          rendered = rendered.replace(regex, legalTerms[currentLanguage][term]);
        });
      }
    }
    
    return rendered;
  };

  // Handle download
  const handleDownload = () => {
    if (!selectedTemplate) return;
    
    const rendered = renderAndTranslateTemplate(selectedTemplate.template, formValues);
    const blob = new Blob([rendered], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-primary font-montserrat text-3xl font-bold mb-4">{t('templates.title', 'Legal Document Templates')}</h1>
        <p className="text-gray-600 mb-6">{t('templates.description', 'Create professional legal documents using our templates. Fill in the required information and generate your document in minutes.')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template selection sidebar */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('templates.filterByCategory', 'Filter by Category')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('templates.selectCategory', 'Select category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('templates.allCategories', 'All Categories')}</SelectItem>
                  <SelectItem value="personal">{t('templates.personal', 'Personal')}</SelectItem>
                  <SelectItem value="business">{t('templates.business', 'Business')}</SelectItem>
                  <SelectItem value="property">{t('templates.property', 'Property')}</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            {filteredTemplates.map(template => (
              <Card 
                key={template.id} 
                className={`transition-all cursor-pointer hover:shadow-md ${selectedTemplate?.id === template.id ? 'border-primary' : 'border-gray-200'}`}
                onClick={() => handleSelectTemplate(template)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl text-primary">
                      <i className={template.icon}></i>
                    </div>
                    <div>
                      <h3 className="font-semibold">{t(`templates.${template.id}.title`, template.title)}</h3>
                      <p className="text-sm text-gray-500 card-description">{t(`templates.${template.id}.description`, template.description)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Document creation area */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedTemplate.title}</CardTitle>
                <CardDescription>{selectedTemplate.description}</CardDescription>
              </CardHeader>
              
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid grid-cols-2 mx-6">
                  <TabsTrigger value="form">{t('templates.fillForm', 'Fill Form')}</TabsTrigger>
                  <TabsTrigger value="preview">{t('templates.preview', 'Preview')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="form">
                  <CardContent>
                    <div className="space-y-4">
                      {selectedTemplate.fields.map(field => (
                        <div key={field.id} className="space-y-2">
                          <label htmlFor={field.id} className="text-sm font-medium">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          
                          {field.type === 'text' && (
                            <Input
                              id={field.id}
                              placeholder={field.placeholder}
                              value={formValues[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              required={field.required}
                            />
                          )}
                          
                          {field.type === 'textarea' && (
                            <Textarea
                              id={field.id}
                              placeholder={field.placeholder}
                              value={formValues[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              required={field.required}
                              className="min-h-[100px]"
                            />
                          )}
                          
                          {field.type === 'select' && field.options && (
                            <Select 
                              value={formValues[field.id] || ''} 
                              onValueChange={(value) => handleInputChange(field.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options.map(option => (
                                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end">
                    <Button onClick={generateDocument}>
                      {t('templates.generateDocument', 'Generate Document')}
                    </Button>
                  </CardFooter>
                </TabsContent>
                
                <TabsContent value="preview">
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <ScrollArea className="h-[500px] w-full pr-4">
                        <pre className="whitespace-pre-wrap font-mono text-sm">
                          {renderAndTranslateTemplate(selectedTemplate.template, formValues)}
                        </pre>
                      </ScrollArea>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentTab('form')}>
                      {t('templates.backToEdit', 'Back to Edit')}
                    </Button>
                    <Button onClick={handleDownload}>
                      <i className="ri-download-line mr-2"></i>
                      {t('templates.download', 'Download Document')}
                    </Button>
                  </CardFooter>
                </TabsContent>
              </Tabs>
            </Card>
          ) : (
            <Card>
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="text-6xl text-gray-200 mb-4">
                  <i className="ri-file-list-3-line"></i>
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  {t('templates.selectPrompt', 'Select a Template')}
                </h3>
                <p className="text-gray-500">
                  {t('templates.selectDescription', 'Choose a template from the list to get started with your legal document.')}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
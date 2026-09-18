import { Contact, Lead, Deal, Activity, Task } from '../types/crm';

export interface AiResponse {
  answer: string;
  suggestedActions?: { label: string; actionType: 'view_lead' | 'view_deal' | 'create_task' | 'create_activity'; id?: string }[];
  contextUsed: string;
}

export async function askCrmAssistant(
  prompt: string,
  contextData: {
    contacts: Contact[];
    leads: Lead[];
    deals: Deal[];
    activities: Activity[];
    tasks: Task[];
    activeContact?: Contact;
  }
): Promise<AiResponse> {
  const normalized = prompt.trim().toLowerCase();
  const { contacts, leads, deals, activities, tasks, activeContact } = contextData;

  // Check if an optional external Gemini API Key is provided via client env
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey.length > 5) {
    try {
      // Lazy fetch to avoid dependency breaks if Gemini endpoint isn't accessible
      const crmSummaryText = `
CRM Context:
- Active Contact: ${activeContact ? `${activeContact.firstName} ${activeContact.lastName} (${activeContact.organization})` : 'None'}
- Total Contacts: ${contacts.length}
- High Value Deals: ${deals.filter(d => d.value > 100000).map(d => `${d.dealName}: $${d.value.toLocaleString()} (${d.stage})`).join(', ')}
- Urgent/High Priority Leads: ${leads.filter(l => l.priority === 'High' || l.priority === 'Urgent').map(l => `${l.leadName} (${l.organization})`).join(', ')}
- Upcoming Tasks: ${tasks.filter(t => t.status !== 'Completed').map(t => `${t.title} [Due: ${t.dueDate}]`).join('; ')}
`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are an elite Healthcare CRM Sales Assistant. Answer the user prompt accurately based on this live CRM context:\n\n${crmSummaryText}\n\nUser Question: ${prompt}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        const geminiText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (geminiText) {
          return {
            answer: geminiText,
            contextUsed: 'Live Gemini 1.5 Flash Provider',
          };
        }
      }
    } catch {
      // Graceful fallback to deterministic local engine if network fails
    }
  }

  // Deterministic Local AI Engine (100% Reliable without API Key)

  // 1. Contact Summary
  if (normalized.includes('contact') && (normalized.includes('summar') || normalized.includes('who') || normalized.includes('tell me about'))) {
    const target = activeContact || contacts[0];
    const relatedDeals = deals.filter(d => d.contactId === target.id);
    const relatedActs = activities.filter(a => a.contactId === target.id);

    return {
      answer: `### Clinical Profile Summary: ${target.firstName} ${target.lastName}
- **Affiliation:** ${target.jobTitle} at **${target.organization}**
- **Relationship Tier:** ${target.status} (${target.leadSource} acquisition)
- **Specialty Tags:** ${target.tags.join(', ')}
- **Associated Pipeline:** ${relatedDeals.length > 0 ? relatedDeals.map(d => `${d.dealName} ($${d.value.toLocaleString()} in ${d.stage})`).join(', ') : 'No active deal linked'}
- **Recent Engagement:** Last active on ${target.lastActivity}. ${relatedActs.length} historical logged activities.
- **Executive Note:** "${target.notes}"`,
      contextUsed: `Local CRM Intelligence • Contact Record #${target.id}`,
    };
  }

  // 2. Leads that need follow-up
  if (normalized.includes('lead') && (normalized.includes('follow') || normalized.includes('need') || normalized.includes('urgent') || normalized.includes('priority'))) {
    const urgentLeads = leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost' && (l.priority === 'Urgent' || l.priority === 'High'));
    const list = urgentLeads.map(l => `• **${l.leadName}** (${l.organization}) — Status: *${l.status}*, Est. Value: *$${l.estimatedValue.toLocaleString()}* [Last Contact: ${l.lastContacted}]`).join('\n');

    return {
      answer: `Found **${urgentLeads.length} high-priority leads** requiring outreach:\n\n${list}\n\n**Recommendation:** Prioritize **${urgentLeads[0]?.leadName || 'first lead'}** who submitted an urgent inquiry regarding clinic formulary integration.`,
      suggestedActions: urgentLeads.slice(0, 2).map(l => ({
        label: `View ${l.leadName}`,
        actionType: 'view_lead',
        id: l.id,
      })),
      contextUsed: 'Local Lead Pipeline Analyzer',
    };
  }

  // 3. High-value deals
  if (normalized.includes('deal') || normalized.includes('pipeline') || normalized.includes('high-value') || normalized.includes('value')) {
    const highDeals = [...deals].sort((a, b) => b.value - a.value).slice(0, 4);
    const totalPipeline = deals.filter(d => d.stage !== 'Closed Lost').reduce((sum, d) => sum + d.value, 0);
    const list = highDeals.map(d => `• **${d.dealName}** (${d.organization}) — **$${d.value.toLocaleString()}** | Stage: *${d.stage}* (${d.probability}% close prob)`).join('\n');

    return {
      answer: `### High-Value Clinical Opportunities
Total Active Pipeline is **$${totalPipeline.toLocaleString()}**. Your top revenue opportunities:

${list}

**Closing Alert:** *${highDeals[0]?.dealName}* with ${highDeals[0]?.contactName} is currently in *${highDeals[0]?.stage}* stage expecting close by ${highDeals[0]?.expectedCloseDate}.`,
      contextUsed: 'Local Deal Valuation Engine',
    };
  }

  // 4. Draft a follow-up email
  if (normalized.includes('email') || normalized.includes('draft') || normalized.includes('write')) {
    const recipient = activeContact || contacts[0];
    return {
      answer: `### Suggested Follow-Up Email

**Subject:** Follow-up: Clinical Evaluation Roadmap & Next Steps for ${recipient.organization}

Dear ${recipient.firstName} ${recipient.lastName},

Thank you for your valuable insights during our recent discussion regarding clinical technology integration at ${recipient.organization}. 

Following up on our conversation, I have prepared the requested documentation, including:
1. Validated clinical endpoints and hospital efficacy benchmarks
2. Enterprise GxP & HIPAA compliance security architecture
3. Proposed phased onboarding schedule tailored to your department

Would Tuesday or Thursday morning at 8:00 AM work for a brief 15-minute briefing to review your committee's feedback?

Best regards,

**Parth Atrishi**  
Senior Healthcare Account Executive  
HealthPulse Medical Systems`,
      contextUsed: `Email Composer • Context: ${recipient.firstName} ${recipient.lastName}`,
    };
  }

  // 5. Summarize today's activities / tasks
  if (normalized.includes('activit') || normalized.includes('today') || normalized.includes('task') || normalized.includes('schedule')) {
    const scheduledActs = activities.filter(a => a.status === 'Scheduled');
    const openTasks = tasks.filter(t => t.status !== 'Completed');
    const actList = scheduledActs.map(a => `• **${a.type}** with ${a.relatedName}: *${a.subject}* (${a.dateTime})`).join('\n') || '• No upcoming activities scheduled today.';
    const taskList = openTasks.slice(0, 3).map(t => `• [${t.priority}] **${t.title}** (Due: ${t.dueDate})`).join('\n');

    return {
      answer: `### Schedule & Action Item Briefing

**Upcoming Healthcare Engagements:**
${actList}

**Top Priority Open Tasks:**
${taskList}

**Operational Focus:** Ensure all regulatory compliance attachments (BAA, 510(k) summary) are signed before hospital executive reviews this afternoon.`,
      contextUsed: 'Local Activity & Task Timeline Engine',
    };
  }

  // Default intelligent overview
  return {
    answer: `I am your **AI Healthcare CRM Assistant**. I have complete real-time visibility into your **${contacts.length} healthcare contacts**, **${leads.length} active leads**, and **$${deals.reduce((s, d) => s + d.value, 0).toLocaleString()} pipeline**.

Try asking:
- *"Summarize this contact"*
- *"What leads need follow-up?"*
- *"Show my high-value deals"*
- *"Draft a follow-up email for Dr. Thorne"*
- *"Summarize today's activities and tasks"*`,
    contextUsed: 'HealthPulse CRM Intelligence Hub',
  };
}

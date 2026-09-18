import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Contact,
  Lead,
  Deal,
  Activity,
  Task,
  Note,
  UserProfile,
  OrgSettings,
  ToastMessage,
  DealStage,
  LeadStatus,
  TaskStatus,
} from '../types/crm';
import {
  INITIAL_CONTACTS,
  INITIAL_LEADS,
  INITIAL_DEALS,
  INITIAL_ACTIVITIES,
  INITIAL_TASKS,
  INITIAL_NOTES,
  INITIAL_USER,
  INITIAL_ORG,
} from '../data/initialData';

interface CRMContextType {
  // Data
  contacts: Contact[];
  leads: Lead[];
  deals: Deal[];
  activities: Activity[];
  tasks: Task[];
  notes: Note[];
  user: UserProfile;
  org: OrgSettings;
  toasts: ToastMessage[];

  // Contacts CRUD
  addContact: (contact: Omit<Contact, 'id' | 'createdDate' | 'lastActivity'>) => Contact;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContact: (id: string) => Contact | undefined;

  // Leads CRUD
  addLead: (lead: Omit<Lead, 'id' | 'createdDate' | 'lastContacted'>) => Lead;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  convertLead: (leadId: string, options: { createDeal?: boolean; dealValue?: number; dealName?: string }) => { contact: Contact; deal?: Deal };

  // Deals CRUD
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => Deal;
  updateDeal: (id: string, deal: Partial<Deal>) => void;
  updateDealStage: (id: string, stage: DealStage) => void;
  deleteDeal: (id: string) => void;

  // Activities CRUD
  addActivity: (activity: Omit<Activity, 'id'>) => Activity;
  updateActivity: (id: string, activity: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;

  // Tasks CRUD
  addTask: (task: Omit<Task, 'id'>) => Task;
  updateTask: (id: string, task: Partial<Task>) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;

  // Notes CRUD
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Profile & Org
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateOrgSettings: (org: Partial<OrgSettings>) => void;

  // Utilities & Persistence
  resetDemoData: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEYS = {
  CONTACTS: 'hp_crm_contacts_v1',
  LEADS: 'hp_crm_leads_v1',
  DEALS: 'hp_crm_deals_v1',
  ACTIVITIES: 'hp_crm_activities_v1',
  TASKS: 'hp_crm_tasks_v1',
  NOTES: 'hp_crm_notes_v1',
  USER: 'hp_crm_user_v1',
  ORG: 'hp_crm_org_v1',
};

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage or Defaults
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEALS);
      return saved ? JSON.parse(saved) : INITIAL_DEALS;
    } catch {
      return INITIAL_DEALS;
    }
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [org, setOrg] = useState<OrgSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORG);
      return saved ? JSON.parse(saved) : INITIAL_ORG;
    } catch {
      return INITIAL_ORG;
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent storage sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORG, JSON.stringify(org));
  }, [org]);

  // Toast Helpers
  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Contacts CRUD
  const addContact = (contactData: Omit<Contact, 'id' | 'createdDate' | 'lastActivity'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newContact: Contact = {
      ...contactData,
      id: `c-${Date.now().toString().slice(-5)}`,
      createdDate: today,
      lastActivity: today,
    };
    setContacts((prev) => [newContact, ...prev]);
    addToast('success', 'Contact Created', `${newContact.firstName} ${newContact.lastName} was added.`);
    return newContact;
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updates, lastActivity: new Date().toISOString().split('T')[0] } : c
      )
    );
    addToast('info', 'Contact Updated', 'Contact details successfully saved.');
  };

  const deleteContact = (id: string) => {
    const target = contacts.find((c) => c.id === id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
    addToast('info', 'Contact Deleted', target ? `${target.firstName} ${target.lastName} removed.` : 'Contact removed.');
  };

  const getContact = (id: string) => contacts.find((c) => c.id === id);

  // Leads CRUD
  const addLead = (leadData: Omit<Lead, 'id' | 'createdDate' | 'lastContacted'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newLead: Lead = {
      ...leadData,
      id: `l-${Date.now().toString().slice(-5)}`,
      createdDate: today,
      lastContacted: today,
    };
    setLeads((prev) => [newLead, ...prev]);
    addToast('success', 'Lead Created', `${newLead.leadName} was added to leads.`);
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    addToast('info', 'Lead Updated', 'Lead details have been updated.');
  };

  const deleteLead = (id: string) => {
    const target = leads.find((l) => l.id === id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    addToast('info', 'Lead Deleted', target ? `${target.leadName} removed.` : 'Lead removed.');
  };

  const convertLead = (
    leadId: string,
    options: { createDeal?: boolean; dealValue?: number; dealName?: string }
  ) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) {
      throw new Error('Lead not found');
    }

    // Split lead name if possible
    const nameParts = targetLead.leadName.split(' ');
    const firstName = nameParts[0] || targetLead.leadName;
    const lastName = nameParts.slice(1).join(' ') || '(HCP)';
    const today = new Date().toISOString().split('T')[0];

    // Create Contact
    const newContact: Contact = {
      id: `c-${Date.now().toString().slice(-5)}`,
      firstName,
      lastName,
      email: targetLead.email,
      phone: targetLead.phone,
      organization: targetLead.organization,
      jobTitle: 'Healthcare Specialist',
      status: 'Active',
      leadSource: targetLead.source,
      tags: ['Converted Lead'],
      notes: targetLead.notes || `Converted from Lead on ${today}`,
      createdDate: today,
      lastActivity: today,
    };

    setContacts((prev) => [newContact, ...prev]);

    let createdDeal: Deal | undefined;
    if (options.createDeal) {
      createdDeal = {
        id: `d-${Date.now().toString().slice(-5)}`,
        dealName: options.dealName || `${targetLead.organization} Expansion Deal`,
        organization: targetLead.organization,
        contactId: newContact.id,
        contactName: `${newContact.firstName} ${newContact.lastName}`,
        value: options.dealValue || targetLead.estimatedValue || 50000,
        probability: 50,
        expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        owner: targetLead.owner || user.name,
        stage: 'Qualification',
        notes: `Spawned from lead conversion: ${targetLead.leadName}`,
        createdAt: today,
      };
      setDeals((prev) => [createdDeal!, ...prev]);
    }

    // Update Lead status to Converted
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'Converted' as LeadStatus } : l))
    );

    // Add activity record
    const conversionActivity: Activity = {
      id: `a-${Date.now().toString().slice(-5)}`,
      contactId: newContact.id,
      leadId: targetLead.id,
      relatedName: `${newContact.firstName} ${newContact.lastName}`,
      type: 'Follow-up',
      subject: 'Lead converted to active Contact',
      description: `Converted lead ${targetLead.leadName}. ${
        options.createDeal ? `Associated deal "${createdDeal?.dealName}" initialized.` : ''
      }`,
      dateTime: `${today} 09:00`,
      status: 'Completed',
    };
    setActivities((prev) => [conversionActivity, ...prev]);

    addToast(
      'success',
      'Lead Converted',
      `${targetLead.leadName} successfully converted to Contact${
        options.createDeal ? ' and Deal created.' : '.'
      }`
    );

    return { contact: newContact, deal: createdDeal };
  };

  // Deals CRUD
  const addDeal = (dealData: Omit<Deal, 'id' | 'createdAt'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newDeal: Deal = {
      ...dealData,
      id: `d-${Date.now().toString().slice(-5)}`,
      createdAt: today,
    };
    setDeals((prev) => [newDeal, ...prev]);
    addToast('success', 'Deal Created', `${newDeal.dealName} added to pipeline.`);
    return newDeal;
  };

  const updateDeal = (id: string, updates: Partial<Deal>) => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    addToast('info', 'Deal Updated', 'Deal pipeline metrics updated.');
  };

  const updateDealStage = (id: string, stage: DealStage) => {
    const target = deals.find((d) => d.id === id);
    if (!target) return;

    let probability = target.probability;
    if (stage === 'Qualification') probability = 20;
    else if (stage === 'Discovery') probability = 40;
    else if (stage === 'Proposal') probability = 60;
    else if (stage === 'Negotiation') probability = 80;
    else if (stage === 'Closed Won') probability = 100;
    else if (stage === 'Closed Lost') probability = 0;

    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, stage, probability } : d))
    );

    addToast('info', 'Stage Changed', `Moved to ${stage} (${probability}% probability)`);
  };

  const deleteDeal = (id: string) => {
    const target = deals.find((d) => d.id === id);
    setDeals((prev) => prev.filter((d) => d.id !== id));
    addToast('info', 'Deal Removed', target ? `${target.dealName} deleted.` : 'Deal deleted.');
  };

  // Activities CRUD
  const addActivity = (activityData: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: `a-${Date.now().toString().slice(-5)}`,
    };
    setActivities((prev) => [newActivity, ...prev]);

    // Update related contact's last activity date
    if (activityData.contactId) {
      const today = new Date().toISOString().split('T')[0];
      setContacts((prev) =>
        prev.map((c) => (c.id === activityData.contactId ? { ...c, lastActivity: today } : c))
      );
    }

    addToast('success', 'Activity Logged', `${newActivity.type}: ${newActivity.subject}`);
    return newActivity;
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    addToast('info', 'Activity Updated', 'Activity changes saved.');
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    addToast('info', 'Activity Removed', 'Activity record deleted.');
  };

  // Tasks CRUD
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now().toString().slice(-5)}`,
    };
    setTasks((prev) => [newTask, ...prev]);
    addToast('success', 'Task Created', newTask.title);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    addToast('info', 'Task Updated', 'Task was updated.');
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextStatus: TaskStatus = t.status === 'Completed' ? 'Todo' : 'Completed';
        const completedAt = nextStatus === 'Completed' ? new Date().toISOString().split('T')[0] : undefined;
        return { ...t, status: nextStatus, completedAt };
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addToast('info', 'Task Deleted', 'Task removed from your queue.');
  };

  // Notes CRUD
  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...noteData,
      id: `n-${Date.now().toString().slice(-5)}`,
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
    addToast('success', 'Note Created', newNote.title);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const now = new Date().toISOString();
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: now } : n)));
    addToast('info', 'Note Updated', 'Note updated successfully.');
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    addToast('info', 'Note Deleted', 'Note permanently removed.');
  };

  // Profile & Org
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
    addToast('success', 'Profile Saved', 'Your user preferences have been updated.');
  };

  const updateOrgSettings = (orgSettings: Partial<OrgSettings>) => {
    setOrg((prev) => ({ ...prev, ...orgSettings }));
    addToast('success', 'Organization Saved', 'Organization profile updated.');
  };

  // Demo Reset & Export/Import
  const resetDemoData = () => {
    setContacts(INITIAL_CONTACTS);
    setLeads(INITIAL_LEADS);
    setDeals(INITIAL_DEALS);
    setActivities(INITIAL_ACTIVITIES);
    setTasks(INITIAL_TASKS);
    setNotes(INITIAL_NOTES);
    setUser(INITIAL_USER);
    setOrg(INITIAL_ORG);

    localStorage.removeItem(STORAGE_KEYS.CONTACTS);
    localStorage.removeItem(STORAGE_KEYS.LEADS);
    localStorage.removeItem(STORAGE_KEYS.DEALS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ORG);

    addToast('info', 'Data Reset', 'All records restored to fresh healthcare demo state.');
  };

  const exportDataJson = () => {
    const crmDump = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user,
      org,
      contacts,
      leads,
      deals,
      activities,
      tasks,
      notes,
    };
    return JSON.stringify(crmDump, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.contacts)) setContacts(parsed.contacts);
      if (Array.isArray(parsed.leads)) setLeads(parsed.leads);
      if (Array.isArray(parsed.deals)) setDeals(parsed.deals);
      if (Array.isArray(parsed.activities)) setActivities(parsed.activities);
      if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      if (Array.isArray(parsed.notes)) setNotes(parsed.notes);
      if (parsed.user) setUser(parsed.user);
      if (parsed.org) setOrg(parsed.org);

      addToast('success', 'Import Succeeded', 'CRM database loaded successfully from JSON.');
      return true;
    } catch (e) {
      addToast('error', 'Import Failed', 'Invalid JSON structure provided.');
      return false;
    }
  };

  return (
    <CRMContext.Provider
      value={{
        contacts,
        leads,
        deals,
        activities,
        tasks,
        notes,
        user,
        org,
        toasts,
        addContact,
        updateContact,
        deleteContact,
        getContact,
        addLead,
        updateLead,
        deleteLead,
        convertLead,
        addDeal,
        updateDeal,
        updateDealStage,
        deleteDeal,
        addActivity,
        updateActivity,
        deleteActivity,
        addTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        addNote,
        updateNote,
        deleteNote,
        updateUserProfile,
        updateOrgSettings,
        resetDemoData,
        exportDataJson,
        importDataJson,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};

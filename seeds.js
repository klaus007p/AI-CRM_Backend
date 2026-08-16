import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { User } from './models/User.models.js';
import { Contact } from './models/Contact.models.js';
import { Lead } from './models/Lead.models.js';
import { Task } from './models/Task.model.js';

dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined in the environment.');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
};

const seedUser = async () => {
  const email = 'rahul@gmail.com';
  const password = 'test@1234';

  let user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    user = await User.create({
      name: 'Rahul Sharma',
      email,
      password,
      company: 'AICRM',
      role: 'Owner',
    });

    console.log('Seed user created:', user.email);
  } else {
    console.log('Seed user already exists:', user.email);
  }

  return user;
};

const seedContacts = async (ownerId) => {
  const contactList = [
    { name: 'Aarav Mehta', email: 'aarav@example.com', phone: '9876543210', company: 'Nova Labs', title: 'Operations Manager', notes: 'Interested in automation.' },
    { name: 'Priya Sen', email: 'priya@example.com', phone: '9123456780', company: 'BluePeak', title: 'Marketing Lead', notes: 'Wants a demo this week.' },
    { name: 'Karan Shah', email: 'karan@example.com', phone: '9988776655', company: 'Skyline', title: 'VP Sales', notes: 'High-value prospect.' },
    { name: 'Neha Kapoor', email: 'neha@example.com', phone: '9812345678', company: 'TerraNova', title: 'Head of Growth', notes: 'Looking for forecasting tools.' },
    { name: 'Vikram Joshi', email: 'vikram@example.com', phone: '9001122334', company: 'LumaGrid', title: 'Sales Director', notes: 'Interested in multi-stage pipeline workflows.' },
  ];

  const contacts = [];

  for (let i = 0; i < contactList.length; i++) {
    contacts.push({
      owner: ownerId,
      ...contactList[i],
      favorite: i === 0,
    });
  }

  const createdContacts = await Contact.insertMany(contacts);
  console.log('Contacts seeded:', createdContacts.length);
  return createdContacts;
};

const seedLeads = async (ownerId) => {
  const now = new Date();
  
  const leadList = [
    // March leads
    { name: 'Rohit Verma', company: 'Northstar', email: 'rohit@example.com', phone: '9811122233', status: 'New', priority: 'High', value: 12000, createdAt: new Date(now.getFullYear(), now.getMonth() - 5, 5) },
    { name: 'Meera Iyer', company: 'PulseGrid', email: 'meera@example.com', phone: '9765432109', status: 'Won', priority: 'Medium', value: 28500, createdAt: new Date(now.getFullYear(), now.getMonth() - 5, 12) },
    
    // April leads
    { name: 'Siddharth Rao', company: 'Vertex Works', email: 'siddharth@example.com', phone: '9654321098', status: 'Proposal', priority: 'High', value: 26000, createdAt: new Date(now.getFullYear(), now.getMonth() - 4, 3) },
    { name: 'Nisha Patel', company: 'SummitFlow', email: 'nisha@example.com', phone: '9722334455', status: 'Won', priority: 'High', value: 42000, createdAt: new Date(now.getFullYear(), now.getMonth() - 4, 15) },
    { name: 'Arjun Singh', company: 'OrbitOne', email: 'arjun@example.com', phone: '9898989898', status: 'Lost', priority: 'Medium', value: 15000, createdAt: new Date(now.getFullYear(), now.getMonth() - 4, 20) },
    
    // May leads
    { name: 'Ananya Bose', company: 'BrightCore', email: 'ananya@example.com', phone: '9877001234', status: 'Qualified', priority: 'High', value: 32000, createdAt: new Date(now.getFullYear(), now.getMonth() - 3, 8) },
    { name: 'David Lee', company: 'ApexWorks', email: 'david@example.com', phone: '9822334455', status: 'Proposal', priority: 'High', value: 47000, createdAt: new Date(now.getFullYear(), now.getMonth() - 3, 18) },
    { name: 'Kavya Nair', company: 'Helio Labs', email: 'kavya@example.com', phone: '9888776655', status: 'Won', priority: 'Medium', value: 35000, createdAt: new Date(now.getFullYear(), now.getMonth() - 3, 25) },
    
    // June leads
    { name: 'Ravi Kumar', company: 'CloudSync', email: 'ravi@example.com', phone: '9765123456', status: 'Qualified', priority: 'High', value: 38000, createdAt: new Date(now.getFullYear(), now.getMonth() - 2, 7) },
    { name: 'Priya Sharma', company: 'DataFlow', email: 'priya@example.com', phone: '9811223344', status: 'Won', priority: 'High', value: 51000, createdAt: new Date(now.getFullYear(), now.getMonth() - 2, 14) },
    
    // July leads
    { name: 'Amit Patel', company: 'TechVision', email: 'amit@example.com', phone: '9888001122', status: 'Proposal', priority: 'High', value: 44000, createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 10) },
    { name: 'Sophie Chen', company: 'InnovateLabs', email: 'sophie@example.com', phone: '9765432101', status: 'Won', priority: 'High', value: 39000, createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 22) },
    
    // August leads
    { name: 'Rahul Gupta', company: 'FutureScale', email: 'rahul@example.com', phone: '9812345670', status: 'New', priority: 'Medium', value: 16000, createdAt: new Date(now.getFullYear(), now.getMonth(), 3) },
    { name: 'Lisa Wong', company: 'StrategyHub', email: 'lisa@example.com', phone: '9899887766', status: 'Qualified', priority: 'High', value: 55000, createdAt: new Date(now.getFullYear(), now.getMonth(), 11) },
  ];

  const leads = [];

  for (let i = 0; i < leadList.length; i++) {
    leads.push({
      owner: ownerId,
      ...leadList[i],
      source: i % 3 === 0 ? 'Website' : i % 3 === 1 ? 'Referral' : 'Social',
      tags: 'seed-data',
      order: i + 1,
    });
  }

  const createdLeads = await Lead.insertMany(leads);
  console.log('Leads seeded:', createdLeads.length);
  return createdLeads;
};

const seedTasks = async (ownerId, leads) => {
  const taskList = [
    { title: 'Follow up with Northstar lead', description: 'Send proposal and ask for meeting.', status: 'Pending', priority: 'High', relatedLead: leads[0]?._id || null },
    { title: 'Review PulseGrid needs', description: 'Collect CRM requirements and confirm scope.', status: 'In Progress', priority: 'Medium', relatedLead: leads[1]?._id || null },
    { title: 'Prepare demo deck', description: 'Create onboarding demo for Vertex Works.', status: 'Pending', priority: 'High', relatedLead: leads[2]?._id || null },
    { title: 'Close SummitFlow renewal', description: 'Prepare final pricing and onboarding summary.', status: 'Completed', priority: 'High', relatedLead: leads[3]?._id || null, completedAt: new Date() },
    { title: 'Re-engage OrbitOne', description: 'Review lost reasons and send a value-based follow-up.', status: 'Pending', priority: 'Low', relatedLead: leads[4]?._id || null },
  ];

  const tasks = [];

  for (let i = 0; i < taskList.length; i++) {
    tasks.push({
      owner: ownerId,
      ...taskList[i],
      dueDate: new Date(Date.now() + (i + 1) * 86400000),
    });
  }

  const createdTasks = await Task.insertMany(tasks);
  console.log('Tasks seeded:', createdTasks.length);
  return createdTasks;
};

const seedDatabase = async () => {
  await connectDB();

  const user = await seedUser();
  const contacts = await seedContacts(user._id);
  const leads = await seedLeads(user._id);
  await seedTasks(user._id, leads);

  console.log('Database seeding complete.');
  await mongoose.disconnect();
};

seedDatabase().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});

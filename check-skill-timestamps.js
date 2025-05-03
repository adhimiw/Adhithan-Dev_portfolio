import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function checkSkillTimestamps() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('portfolio');
    const skills = await db.collection('skills').find({}).toArray();
    
    console.log('Number of skills:', skills.length);
    
    skills.forEach((skill, index) => {
      console.log(`Skill ${index + 1}:`);
      console.log('  Name:', skill.name);
      console.log('  Category:', skill.category);
      console.log('  Level:', skill.level);
      console.log('  Created At:', skill.createdAt);
      console.log('  Updated At:', skill.updatedAt);
      console.log('  Icon:', skill.icon ? 'Has icon' : 'No icon');
      console.log('  _id:', skill._id);
      console.log('');
    });
    
    // Add timestamps to skills that don't have them
    const skillsWithoutTimestamps = skills.filter(skill => !skill.createdAt || !skill.updatedAt);
    
    if (skillsWithoutTimestamps.length > 0) {
      console.log(`Found ${skillsWithoutTimestamps.length} skills without timestamps. Adding timestamps...`);
      
      const now = new Date();
      
      for (const skill of skillsWithoutTimestamps) {
        await db.collection('skills').updateOne(
          { _id: skill._id },
          { 
            $set: { 
              createdAt: skill.createdAt || now,
              updatedAt: skill.updatedAt || now
            } 
          }
        );
        console.log(`Added timestamps to skill: ${skill.name}`);
      }
      
      console.log('Timestamps added successfully.');
    } else {
      console.log('All skills have timestamps.');
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

checkSkillTimestamps();

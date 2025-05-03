import axios from 'axios';

async function checkSkills() {
  try {
    const response = await axios.get('http://localhost:5000/api/skills');
    console.log('Skills API Response:', response.data);
    console.log('Number of skills:', response.data.length);

    if (response.data.length > 0) {
      console.log('First skill:', response.data[0]);
    } else {
      console.log('No skills found in the database.');
    }
  } catch (error) {
    console.error('Error fetching skills:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

checkSkills();

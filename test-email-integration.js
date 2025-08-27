// Simple test script to verify email integration
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api/send-email';

// Test data for RequestTechnician form
const technicianTestData = {
  name: 'John Doe',
  phone: '+370612345678',
  email: 'john.doe@example.com',
  city: 'Vilnius',
  message: 'I need window repair urgently',
  privacy: true,
  formType: 'technician',
  triggerType: 'technician',
  locale: 'en',
  timestamp: new Date().toISOString(),
  website: '' // Honeypot field
};

// Test data for Contact form
const contactTestData = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  phone: '+370687654321',
  service: 'window-repair',
  message: 'I would like to get a quote for window installation',
  formType: 'contact',
  locale: 'en',
  timestamp: new Date().toISOString(),
  website: '' // Honeypot field
};

// Test spam detection
const spamTestData = {
  name: 'Spammer123',
  phone: '+370123456789',
  email: 'spam@example.com',
  message: 'Buy viagra now! Click here for amazing deals! Make money fast!',
  formType: 'technician',
  locale: 'en',
  timestamp: new Date().toISOString(),
  website: 'spam-site.com' // Honeypot triggered
};

async function testEmailAPI(testName, data) {
  console.log(`\n🧪 Testing: ${testName}`);
  console.log('📤 Sending data:', JSON.stringify(data, null, 2));
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    console.log(`📊 Status: ${response.status}`);
    console.log('📥 Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Test PASSED');
    } else {
      console.log('❌ Test FAILED');
    }
    
    return result;
  } catch (error) {
    console.log('💥 Network Error:', error.message);
    console.log('❌ Test FAILED');
    return null;
  }
}

async function testRateLimit() {
  console.log('\n🚦 Testing Rate Limiting (3 rapid requests)');
  
  const promises = [];
  for (let i = 0; i < 3; i++) {
    const testData = {
      ...technicianTestData,
      name: `Rate Test ${i + 1}`,
      timestamp: new Date().toISOString()
    };
    promises.push(testEmailAPI(`Rate Limit Test ${i + 1}`, testData));
  }
  
  await Promise.all(promises);
}

async function runAllTests() {
  console.log('🚀 Starting Email Integration Tests');
  console.log('=====================================');
  
  // Test 1: Valid RequestTechnician submission
  await testEmailAPI('RequestTechnician Form (Valid)', technicianTestData);
  
  // Wait a bit to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: Valid Contact form submission
  await testEmailAPI('Contact Form (Valid)', contactTestData);
  
  // Wait a bit to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 3: Spam detection
  await testEmailAPI('Spam Detection Test', spamTestData);
  
  // Test 4: Rate limiting
  await testRateLimit();
  
  // Test 5: Invalid data
  await testEmailAPI('Invalid Data Test', {
    name: '', // Missing required field
    formType: 'invalid',
    locale: 'invalid'
  });
  
  // Test 6: Different locales
  const lithuanianTest = {
    ...technicianTestData,
    name: 'Petras Petraitis',
    locale: 'lt',
    message: 'Reikia skubaus langų remonto'
  };
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  await testEmailAPI('Lithuanian Locale Test', lithuanianTest);
  
  console.log('\n🏁 All tests completed!');
  console.log('=====================================');
  console.log('📧 Check your business email for notifications');
  console.log('📝 Review the console logs above for results');
}

// Handle command line execution
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testEmailAPI, runAllTests };

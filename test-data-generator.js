// Test Data Generator for ReportSonic
const XLSX = require('xlsx')

// Generate realistic business data
function generateSalesData() {
  const data = []
  const headers = [
    'Date', 'Product', 'Category', 'Sales_Amount', 'Quantity', 'Customer_Type', 
    'Region', 'Sales_Rep', 'Profit_Margin', 'Customer_Satisfaction', 'Marketing_Channel'
  ]
  
  const products = [
    'Laptop Pro', 'Smartphone X', 'Tablet Air', 'Desktop Power', 'Monitor Ultra',
    'Keyboard Elite', 'Mouse Wireless', 'Headphones Pro', 'Camera DSLR', 'Speaker Boom'
  ]
  
  const categories = ['Electronics', 'Computers', 'Accessories', 'Audio', 'Photography']
  const customerTypes = ['Individual', 'Business', 'Enterprise', 'Government', 'Non-Profit']
  const regions = ['North', 'South', 'East', 'West', 'Central']
  const salesReps = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Chen', 'David Wilson']
  const marketingChannels = ['Online', 'Retail', 'Direct Sales', 'Partner', 'Social Media']
  
  const startDate = new Date('2023-01-01')
  const endDate = new Date('2024-01-01')
  
  for (let i = 0; i < 1000; i++) {
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
    const product = products[Math.floor(Math.random() * products.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const salesAmount = Math.floor(Math.random() * 5000) + 100
    const quantity = Math.floor(Math.random() * 10) + 1
    const customerType = customerTypes[Math.floor(Math.random() * customerTypes.length)]
    const region = regions[Math.floor(Math.random() * regions.length)]
    const salesRep = salesReps[Math.floor(Math.random() * salesReps.length)]
    const profitMargin = (Math.random() * 0.4 + 0.1).toFixed(2)
    const satisfaction = Math.floor(Math.random() * 5) + 1
    const marketingChannel = marketingChannels[Math.floor(Math.random() * marketingChannels.length)]
    
    data.push([
      randomDate.toISOString().split('T')[0],
      product,
      category,
      salesAmount,
      quantity,
      customerType,
      region,
      salesRep,
      profitMargin,
      satisfaction,
      marketingChannel
    ])
  }
  
  return [headers, ...data]
}

// Generate financial data
function generateFinancialData() {
  const data = []
  const headers = [
    'Month', 'Revenue', 'Expenses', 'Profit', 'Marketing_Spend', 'R&D_Spend',
    'Employee_Count', 'Customer_Acquisition_Cost', 'Customer_Lifetime_Value', 'Churn_Rate'
  ]
  
  const months = [
    '2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06',
    '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12'
  ]
  
  months.forEach(month => {
    const revenue = Math.floor(Math.random() * 500000) + 200000
    const expenses = Math.floor(revenue * (0.6 + Math.random() * 0.2))
    const profit = revenue - expenses
    const marketingSpend = Math.floor(revenue * (0.1 + Math.random() * 0.05))
    const rdSpend = Math.floor(revenue * (0.05 + Math.random() * 0.03))
    const employeeCount = Math.floor(Math.random() * 50) + 20
    const cac = Math.floor(Math.random() * 200) + 50
    const clv = Math.floor(Math.random() * 2000) + 500
    const churnRate = (Math.random() * 0.1 + 0.02).toFixed(3)
    
    data.push([
      month,
      revenue,
      expenses,
      profit,
      marketingSpend,
      rdSpend,
      employeeCount,
      cac,
      clv,
      churnRate
    ])
  })
  
  return [headers, ...data]
}

// Generate customer data
function generateCustomerData() {
  const data = []
  const headers = [
    'Customer_ID', 'Name', 'Email', 'Age', 'Gender', 'City', 'Country',
    'Registration_Date', 'Last_Purchase', 'Total_Spent', 'Purchase_Count',
    'Preferred_Category', 'Loyalty_Score', 'Referral_Source'
  ]
  
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Chris', 'Emma', 'Alex', 'Maria']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
  const countries = ['USA', 'Canada', 'Mexico', 'UK', 'Germany', 'France', 'Australia', 'Japan', 'Brazil', 'India']
  const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Beauty', 'Automotive', 'Health']
  const referralSources = ['Google', 'Facebook', 'Instagram', 'Twitter', 'Email', 'Direct', 'Referral', 'Advertisement']
  
  for (let i = 1; i <= 500; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`
    const age = Math.floor(Math.random() * 50) + 18
    const gender = Math.random() > 0.5 ? 'Male' : 'Female'
    const city = cities[Math.floor(Math.random() * cities.length)]
    const country = countries[Math.floor(Math.random() * countries.length)]
    const regDate = new Date(2020 + Math.random() * 4, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    const lastPurchase = new Date(regDate.getTime() + Math.random() * (Date.now() - regDate.getTime()))
    const totalSpent = Math.floor(Math.random() * 5000) + 100
    const purchaseCount = Math.floor(Math.random() * 20) + 1
    const preferredCategory = categories[Math.floor(Math.random() * categories.length)]
    const loyaltyScore = Math.floor(Math.random() * 100) + 1
    const referralSource = referralSources[Math.floor(Math.random() * referralSources.length)]
    
    data.push([
      `CUST-${i.toString().padStart(4, '0')}`,
      `${firstName} ${lastName}`,
      email,
      age,
      gender,
      city,
      country,
      regDate.toISOString().split('T')[0],
      lastPurchase.toISOString().split('T')[0],
      totalSpent,
      purchaseCount,
      preferredCategory,
      loyaltyScore,
      referralSource
    ])
  }
  
  return [headers, ...data]
}

// Generate the Excel file
function generateTestExcel() {
  console.log('📊 Generating comprehensive test data...')
  
  // Create workbook
  const wb = XLSX.utils.book_new()
  
  // Add Sales Data sheet
  const salesData = generateSalesData()
  const salesWS = XLSX.utils.aoa_to_sheet(salesData)
  XLSX.utils.book_append_sheet(wb, salesWS, 'Sales_Data')
  
  // Add Financial Data sheet
  const financialData = generateFinancialData()
  const financialWS = XLSX.utils.aoa_to_sheet(financialData)
  XLSX.utils.book_append_sheet(wb, financialWS, 'Financial_Data')
  
  // Add Customer Data sheet
  const customerData = generateCustomerData()
  const customerWS = XLSX.utils.aoa_to_sheet(customerData)
  XLSX.utils.book_append_sheet(wb, customerWS, 'Customer_Data')
  
  // Write file
  XLSX.writeFile(wb, 'test-data-comprehensive.xlsx')
  
  console.log('✅ Test data generated successfully!')
  console.log('📁 File: test-data-comprehensive.xlsx')
  console.log('📊 Contains:')
  console.log('   - Sales Data: 1000 records (11 columns)')
  console.log('   - Financial Data: 12 months (10 columns)')
  console.log('   - Customer Data: 500 records (14 columns)')
  console.log('🚀 Ready for upload and testing!')
}

// Run the generator
generateTestExcel()

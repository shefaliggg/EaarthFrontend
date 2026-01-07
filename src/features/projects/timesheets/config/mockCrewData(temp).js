export const generateMockCrewData = () => {
  const departments = [
    'Camera', 'Lighting', 'Grip', 'Sound', 'Art Department', 'Costume', 
    'Makeup/Hair', 'Production', 'Locations', 'Post-Production', 
    'Accounts', 'VFX', 'Stunts', 'Props'
  ];

  const crewData = [
    // CAMERA DEPARTMENT
    { id: '1', name: 'Mitchell, Sarah', role: 'Director of Photography', department: 'Camera', contractType: 'Weekly', contractCategory: 'LOAN OUT', workPattern: 'long', rate: 4500, companyName: 'Sarah Mitchell Productions Ltd' },
    { id: '2', name: 'Chen, James', role: 'A Camera Operator', department: 'Camera', contractType: 'Weekly', contractCategory: 'PAYE', workPattern: 'long', rate: 3200 },
    { id: '3', name: 'Thompson, Emma', role: '1st AC', department: 'Camera', contractType: 'Daily', contractCategory: 'SCHD', workPattern: 'standard', rate: 450 },
    { id: '4', name: 'Park, David', role: '2nd AC', department: 'Camera', contractType: 'Daily', contractCategory: 'PAYE', workPattern: 'standard', rate: 380 },
    { id: '5', name: 'Rodriguez, Lisa', role: 'DIT', department: 'Camera', contractType: 'Weekly', contractCategory: 'PAYE', workPattern: 'long', rate: 2800 },

    // LIGHTING DEPARTMENT
    { id: '6', name: 'O\'Brien, Michael', role: 'Gaffer', department: 'Lighting', contractType: 'Weekly', contractCategory: 'LOAN OUT', workPattern: 'long', rate: 3500, companyName: 'Bright Light Services Ltd' },
    { id: '7', name: 'Green, Rachel', role: 'Best Boy Electric', department: 'Lighting', contractType: 'Daily', contractCategory: 'SCHD', workPattern: 'long', rate: 420 },
    { id: '8', name: 'Bradley, Tom', role: 'Electrician', department: 'Lighting', contractType: 'Daily', contractCategory: 'PAYE', workPattern: 'standard', rate: 350 },
    { id: '9', name: 'Patel, Nina', role: 'Electrician', department: 'Lighting', contractType: 'Daily', contractCategory: 'PAYE', workPattern: 'standard', rate: 350 },
    { id: '10', name: 'Evans, Chris', role: 'Genny Operator', department: 'Lighting', contractType: 'Daily', contractCategory: 'SCHD', workPattern: 'standard', rate: 380 },

    // GRIP DEPARTMENT
    { id: '11', name: 'Morrison, Jake', role: 'Key Grip', department: 'Grip', contractType: 'Weekly', contractCategory: 'LOAN OUT', workPattern: 'long', rate: 3200, companyName: 'Morrison Grip Services Ltd' },
    { id: '12', name: 'Turner, Sophie', role: 'Best Boy Grip', department: 'Grip', contractType: 'Daily', contractCategory: 'SCHD', workPattern: 'long', rate: 410 },
    { id: '13', name: 'Wong, Marcus', role: 'Dolly Grip', department: 'Grip', contractType: 'Daily', contractCategory: 'PAYE', workPattern: 'standard', rate: 380 },
    { id: '14', name: 'Williams, Zoe', role: 'Grip', department: 'Grip', contractType: 'Daily', contractCategory: 'PAYE', workPattern: 'standard', rate: 340 },

    // SOUND DEPARTMENT
    { id: '15', name: 'Campbell, Alex', role: 'Production Sound Mixer', department: 'Sound', contractType: 'Weekly', contractCategory: 'LOAN OUT', workPattern: 'long', rate: 3800, companyName: 'Campbell Sound Ltd' },
    { id: '16', name: 'Lee, Hannah', role: 'Boom Operator', department: 'Sound', contractType: 'Daily', contractCategory: 'SCHD', workPattern: 'standard', rate: 420 },
    { id: '17', name: 'Smith, Oliver', role: 'Sound Assistant', department: 'Sound', contractType: 'Daily', contractCategory: 'PAYE', workPattern: 'standard', rate: 320 },

    // ART DEPARTMENT
    { id: '18', name: 'Hayes, Victoria', role: 'Production Designer', department: 'Art Department', contractType: 'Weekly', contractCategory: 'LOAN OUT', workPattern: 'standard', rate: 4200, companyName: 'Victoria Hayes Design Ltd' },
    { id: '19', name: 'Foster, Daniel', role: 'Art Director', department: 'Art Department', contractType: 'Weekly', contractCategory: 'PAYE', workPattern: 'standard', rate: 3000 },
    { id: '20', name: 'Collins, Amy', role: 'Set Decorator', department: 'Art Department', contractType: 'Daily', contractCategory: 'SCHD', workPattern: 'standard', rate: 450 },
    { id: '21', name: 'Taylor, Ben', role: 'Standby Art Director', department: 'Art Department', contractType: 'Daily', contractCategory: 'PAYE', workPattern: 'long', rate: 380 },
    { id: '22', name: 'Murphy, Grace', role: 'Art Department Assistant', department: 'Art Department', contractType: 'Daily', contractCategory: 'PAYE', workPattern: 'standard', rate: 280 },

    // COSTUME DEPARTMENT
    { id: '23', name: 'Davies, Charlotte', role: 'Costume Designer', department: 'Costume', contractType: 'Weekly', contractCategory: 'LOAN OUT', workPattern: 'standard', rate: 3600, companyName: 'Charlotte Davies Costume Ltd' },
    { id: '24', name: 'Walsh, Rebecca', role: 'Costume Supervisor', department: 'Costume', contractType: 'Weekly', contractCategory: 'PAYE', workPattern: 'standard', rate: 2400 },
    { id: '25', name: 'Morgan, Lucy', role: 'Wardrobe Assistant', department: 'Costume', contractType: 'Daily', contractCategory: 'PAYE', workPattern: 'long', rate: 320 },
    { id: '26', name: 'Anderson, Kate', role: 'Wardrobe Assistant', department: 'Costume', contractType: 'Daily', contractCategory: 'SCHD', workPattern: 'standard', rate: 320 },

    // MAKEUP/HAIR DEPARTMENT
    { id: '27', name: 'Wright, Jessica', role: 'Makeup Designer', department: 'Makeup/Hair', contractType: 'Weekly', contractCategory: 'LOAN OUT', workPattern: 'long', rate: 3400, companyName: 'Jessica Wright Makeup Ltd' },
    { id: '28', name: 'Santos, Maria', role: 'Key Hair', department: 'Makeup/Hair', contractType: 'Daily', contractCategory: 'SCHD', workPattern: 'long', rate: 440 },
    { id: '29', name: 'Bennett, Claire', role: 'Makeup Artist', department: 'Makeup/Hair', contractType: 'Daily', contractCategory: 'PAYE', workPattern: 'long', rate: 380 },

    // PRODUCTION DEPARTMENT
    { id: '30', name: 'Black, Jonathan', role: 'Line Producer', department: 'Production', contractType: 'Weekly', contractCategory: 'LOAN OUT', workPattern: 'standard', rate: 5000, companyName: 'Jonathan Black Productions Ltd' },
    { id: '31', name: 'Carter, Emily', role: 'Production Manager', department: 'Production', contractType: 'Weekly', contractCategory: 'PAYE', workPattern: 'standard', rate: 3200 },
    { id: '32', name: 'Hughes, Robert', role: '1st AD', department: 'Production', contractType: 'Weekly', contractCategory: 'LOAN OUT', workPattern: 'long', rate: 3800, companyName: 'Robert Hughes Ltd' },
    { id: '33', name: 'Martinez, Sophia', role: '2nd AD', department: 'Production', contractType: 'Daily', contractCategory: 'SCHD', workPattern: 'long', rate: 420 },
    { id: '34', name: 'King, Isabella', role: '3rd AD', department: 'Production', contractType: 'Daily', contractCategory: 'PAYE', workPattern: 'long', rate: 340 },
    { id: '35', name: 'Scott, Matthew', role: 'Production Coordinator', department: 'Production', contractType: 'Weekly', contractCategory: 'PAYE', workPattern: 'standard', rate: 2200 },

    // LOCATIONS DEPARTMENT
    { id: '36', name: 'Cooper, Andrew', role: 'Location Manager', department: 'Locations', contractType: 'Weekly', contractCategory: 'LOAN OUT', workPattern: 'standard', rate: 2800, companyName: 'Cooper Locations Ltd' },
    { id: '37', name: 'Jenkins, Laura', role: 'Assistant Location Manager', department: 'Locations', contractType: 'Daily', contractCategory: 'SCHD', workPattern: 'long', rate: 380 },
    { id: '38', name: 'Phillips, Ryan', role: 'Unit Manager', department: 'Locations', contractType: 'Daily', contractCategory: 'PAYE', workPattern: 'long', rate: 340 },

    // POST-PRODUCTION
    { id: '39', name: 'Brooks, Natalie', role: 'Post Supervisor', department: 'Post-Production', contractType: 'Weekly', contractCategory: 'PAYE', workPattern: 'standard', rate: 2600 },
    { id: '40', name: 'Richardson, Sam', role: 'Editor', department: 'Post-Production', contractType: 'Weekly', contractCategory: 'LOAN OUT', workPattern: 'standard', rate: 3400, companyName: 'Sam Richardson Editing Ltd' },
    { id: '41', name: 'Newton, Olivia', role: 'Assistant Editor', department: 'Post-Production', contractType: 'Daily', contractCategory: 'PAYE', workPattern: 'standard', rate: 320 },

    // ACCOUNTS DEPARTMENT
    { id: '42', name: 'Fischer, David', role: 'Production Accountant', department: 'Accounts', contractType: 'Weekly', contractCategory: 'PAYE', workPattern: 'standard', rate: 2800 },
    { id: '43', name: 'Adams, Jennifer', role: 'Assistant Accountant', department: 'Accounts', contractType: 'Weekly', contractCategory: 'SCHD', workPattern: 'standard', rate: 2000 },
    { id: '44', name: 'Kim, Rachel', role: 'Payroll Accountant', department: 'Accounts', contractType: 'Daily', contractCategory: 'SCHD', workPattern: 'standard', rate: 380 },

    // VFX DEPARTMENT
    { id: '45', name: 'Nguyen, Thomas', role: 'VFX Supervisor', department: 'VFX', contractType: 'Weekly', contractCategory: 'LOAN OUT', workPattern: 'standard', rate: 4200, companyName: 'Thomas Nguyen VFX Ltd' },
    { id: '46', name: 'Patel, Maya', role: 'VFX Coordinator', department: 'VFX', contractType: 'Daily', contractCategory: 'SCHD', workPattern: 'standard', rate: 420 },

    // STUNTS
    { id: '47', name: 'Hunter, Jack', role: 'Stunt Coordinator', department: 'Stunts', contractType: 'Daily', contractCategory: 'LOAN OUT', workPattern: 'long', rate: 650, companyName: 'Hunter Stunts Ltd' },
    { id: '48', name: 'Reed, Samantha', role: 'Stunt Performer', department: 'Stunts', contractType: 'Daily', contractCategory: 'SCHD', workPattern: 'standard', rate: 480 },

    // PROPS
    { id: '49', name: 'Barnes, William', role: 'Props Master', department: 'Props', contractType: 'Weekly', contractCategory: 'LOAN OUT', workPattern: 'long', rate: 2800, companyName: 'Barnes Props Ltd' },
    { id: '50', name: 'Stone, Megan', role: 'Standby Props', department: 'Props', contractType: 'Daily', contractCategory: 'PAYE', workPattern: 'long', rate: 360 },
  ];

  // Generate full crew data with timesheets
  return crewData.map((crew, index) => {
    const isWeekly = crew.contractType === 'Weekly';
    const isLong = crew.workPattern === 'long';
    const submitted = index % 3 !== 0; // 2/3 submitted
    const approved = index % 4 === 0; // 1/4 fully approved
    
    // Generate work hours based on pattern
    const generateDay = (day) => {
      if (crew.workPattern === 'long') {
        if (day === 'sat') return { in: '08:00', out: '18:00', status: 'Work', hours: '10', mealBreak: true };
        if (day === 'sun') return { in: '', out: '', status: 'Off', hours: '0' };
        return { in: '07:00', out: '19:00', status: 'Work', hours: '12', mealBreak: true };
      } else {
        if (day === 'sat' || day === 'sun') return { in: '', out: '', status: 'Off', hours: '0' };
        if (day === 'fri') return { in: '09:00', out: '17:00', status: 'Work', hours: '8', mealBreak: true };
        return { in: '09:00', out: '18:00', status: 'Work', hours: '9', mealBreak: true };
      }
    };

    const weekHours = isLong ? 70 : 44;
    const baseCost = isWeekly ? crew.rate : (crew.rate * 5);
    const otCost = isLong ? crew.rate * 0.3 : 0;
    
    return {
      id: crew.id,
      name: crew.name,
      role: crew.role,
      department: crew.department,
      contractType: crew.contractType,
      contractCategory: crew.contractCategory,
      companyName: crew.companyName || '', // Loan Out company name
      activity: 'Active',
      submitted,
      isOff: false,
      approval: {
        hod: approved ? 'approved' : submitted ? 'approved' : 'pending',
        production: approved ? 'approved' : submitted ? (index % 2 === 0 ? 'approved' : 'pending') : 'pending',
        finance: approved ? 'approved' : 'pending',
        payroll: approved ? 'approved' : 'pending',
      },
      weekData: {
        mon: generateDay('mon'),
        tue: generateDay('tue'),
        wed: generateDay('wed'),
        thu: generateDay('thu'),
        fri: generateDay('fri'),
        sat: generateDay('sat'),
        sun: generateDay('sun'),
      },
      totalCost: Math.round(baseCost + otCost),
      sixthDay: isLong ? 1 : 0,
      seventhDay: 0,
      cameraOT: isLong ? (crew.department === 'Camera' ? 4 : 2) : 0,
      preOT: isLong ? 1 : 0,
      postOT: isLong ? 1.5 : 0,
      publicHoliday: 0,
      travelDay: 0,
      turnaround: isLong ? 0.5 : 0,
      mealPenalty: index % 10 === 0 ? 1 : 0,
      // Holiday fields
      // Rules:
      // - Weekly PAYE & Weekly SCHD: Holiday Accrual (if setting enabled)
      // - Weekly Loan Out: NO holiday shown (paid in full, all inclusive)
      // - Daily PAYE & Daily SCHD: Holiday Paid (separate line item)
      // - Daily Loan Out: NO holiday shown (paid in full, all inclusive)
      holidayInc: crew.contractType === 'Daily' && crew.contractCategory !== 'LOAN OUT', // Only Daily PAYE/SCHD get holiday paid
      holidayAccrual: crew.contractType === 'Weekly' && (crew.contractCategory === 'PAYE' || crew.contractCategory === 'SCHD') 
        ? Math.round((weekHours / 40) * 1.73 * 100) / 100  // Weekly PAYE/SCHD accrues
        : undefined, // Loan Out contracts have no holiday field at all
      // VAT Registration - only applies to SCHD and Loan Out (not PAYE)
      // Some SCHD/Loan Out are VAT registered, some are not
      isVATRegistered: (crew.contractCategory === 'SCHD' || crew.contractCategory === 'LOAN OUT') 
        ? index % 2 === 0  // Alternating VAT registration for variety
        : false, // PAYE never has VAT
    };
  });
};
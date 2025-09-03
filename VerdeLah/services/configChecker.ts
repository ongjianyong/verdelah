// Configuration Checker
// This service checks if AWS credentials are properly configured

export interface ConfigStatus {
  isConfigured: boolean;
  missingConfigs: string[];
  warnings: string[];
}

/**
 * Check if AWS configuration is properly set up
 * @returns ConfigStatus object with configuration details
 */
export function checkAWSConfiguration(): ConfigStatus {
  const missingConfigs: string[] = [];
  const warnings: string[] = [];

  // Check for required environment variables
  if (!process.env.EXPO_PUBLIC_AWS_REGION) {
    missingConfigs.push('EXPO_PUBLIC_AWS_REGION');
  }

  if (!process.env.AWS_ACCESS_KEY_ID) {
    missingConfigs.push('AWS_ACCESS_KEY_ID');
  }

  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    missingConfigs.push('AWS_SECRET_ACCESS_KEY');
  }

  // Check for optional but recommended configurations
  if (!process.env.AWS_SESSION_TOKEN && process.env.AWS_ACCESS_KEY_ID) {
    warnings.push('AWS_SESSION_TOKEN not set (optional for temporary credentials)');
  }

  // Validate region format
  if (process.env.EXPO_PUBLIC_AWS_REGION) {
    const region = process.env.EXPO_PUBLIC_AWS_REGION;
    if (!region.match(/^[a-z0-9-]+$/)) {
      warnings.push('AWS region format may be invalid');
    }
  }

  return {
    isConfigured: missingConfigs.length === 0,
    missingConfigs,
    warnings
  };
}

/**
 * Get configuration instructions based on missing configs
 * @param status - ConfigStatus from checkAWSConfiguration
 * @returns Array of instruction strings
 */
export function getConfigurationInstructions(status: ConfigStatus): string[] {
  const instructions: string[] = [];

  if (status.missingConfigs.length > 0) {
    instructions.push('AWS Configuration Required:');
    instructions.push('');
    
    if (status.missingConfigs.includes('EXPO_PUBLIC_AWS_REGION')) {
      instructions.push('1. Set EXPO_PUBLIC_AWS_REGION in your .env file');
      instructions.push('   Example: EXPO_PUBLIC_AWS_REGION=ap-southeast-1');
      instructions.push('');
    }

    if (status.missingConfigs.includes('AWS_ACCESS_KEY_ID')) {
      instructions.push('2. Set AWS_ACCESS_KEY_ID in your .env file');
      instructions.push('   Get this from your AWS IAM console');
      instructions.push('');
    }

    if (status.missingConfigs.includes('AWS_SECRET_ACCESS_KEY')) {
      instructions.push('3. Set AWS_SECRET_ACCESS_KEY in your .env file');
      instructions.push('   Get this from your AWS IAM console');
      instructions.push('');
    }

    instructions.push('4. Create a .env file in your VerdeLah directory');
    instructions.push('5. Restart your development server');
    instructions.push('');
    instructions.push('See AWS_SETUP_GUIDE.md for detailed instructions');
  }

  if (status.warnings.length > 0) {
    instructions.push('Warnings:');
    status.warnings.forEach(warning => {
      instructions.push(`- ${warning}`);
    });
  }

  return instructions;
}

/**
 * Log configuration status to console
 */
export function logConfigurationStatus(): void {
  const status = checkAWSConfiguration();
  
  console.log('🔧 AWS Configuration Status:');
  console.log(`✅ Configured: ${status.isConfigured ? 'Yes' : 'No'}`);
  
  if (status.missingConfigs.length > 0) {
    console.log('❌ Missing configurations:');
    status.missingConfigs.forEach(config => {
      console.log(`   - ${config}`);
    });
  }
  
  if (status.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    status.warnings.forEach(warning => {
      console.log(`   - ${warning}`);
    });
  }
  
  if (!status.isConfigured) {
    console.log('');
    console.log('📖 See AWS_SETUP_GUIDE.md for setup instructions');
  }
}

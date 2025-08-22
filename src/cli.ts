#!/usr/bin/env node

import { Command } from 'commander';
import { OpenAPIGenerator } from './index';
import * as path from 'path';
import * as fs from 'fs';

const program = new Command();

// Configure Commander to store options as properties
program.storeOptionsAsProperties();

program
  .name('oapi-express-gen')
  .description('Generate fully-typed Express.js handlers from OpenAPI specifications')
  .version('1.0.0')
  .argument('<source>', 'Path to OpenAPI specification file (JSON or YAML)')
  .option('-o, --output <path>', 'Output path for generated handlers (default: ./generated/handlers.ts)')
  .option('-t, --template <path>', 'Custom Handlebars template path')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (source: string) => {
    try {
      const options = program.opts();
      
      // Validate source file exists
      if (!fs.existsSync(source)) {
        console.error(`❌ Error: Source file '${source}' does not exist`);
        process.exit(1);
      }

      // Set default output path if not provided
      const outputPath = options.output || './generated/handlers.ts';
      
      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        if (options.verbose) {
          console.log(`📁 Created output directory: ${outputDir}`);
        }
      }

      if (options.verbose) {
        console.log(`🔍 Processing OpenAPI spec: ${source}`);
        console.log(`📝 Output path: ${outputPath}`);
        if (options.template) {
          console.log(`🎨 Using custom template: ${options.template}`);
        }
      }

      // Generate the handlers
      const generator = new OpenAPIGenerator(source, options.template);
      generator.generate(outputPath);

      console.log(`✅ Successfully generated handlers at: ${outputPath}`);
      
      // Show usage instructions
      console.log('\n📖 Next steps:');
      console.log(`   1. Import the generated handlers: import { Handlers } from '${outputPath}'`);
      console.log('   2. Implement your handler functions');
      console.log('   3. Use registerHandlers() to set up Express routes');
      
    } catch (error) {
      console.error('❌ Error generating handlers:', error);
      process.exit(1);
    }
  });

// Add a validate command to check OpenAPI specs
program
  .command('validate')
  .description('Validate OpenAPI specification without generating code')
  .argument('<source>', 'Path to OpenAPI specification file')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (source: string) => {
    try {
      const options = program.opts();
      
      if (!fs.existsSync(source)) {
        console.error(`❌ Error: Source file '${source}' does not exist`);
        process.exit(1);
      }

      if (options.verbose) {
        console.log(`🔍 Validating OpenAPI spec: ${source}`);
      }

      // Try to parse the OpenAPI spec to validate it
      const generator = new OpenAPIGenerator(source);
      
      if (options.verbose) {
        console.log(`📊 Spec info: ${generator.getSpecInfo()}`);
        console.log(`🔧 Operations found: ${generator.getOperationCount()}`);
      }

      console.log('✅ OpenAPI specification is valid');
      
    } catch (error) {
      console.error('❌ Error validating OpenAPI spec:', error);
      process.exit(1);
    }
  });

// Add help information
program.addHelpText('after', `

Examples:
  $ oapi-express-gen ./openapi.json
  $ oapi-express-gen ./openapi.json -o ./src/handlers.ts
  $ oapi-express-gen ./openapi.json -o ./src/handlers.ts -v
  $ oapi-express-gen validate ./openapi.json

For more information, visit: https://github.com/your-repo/oapi-express-gen
`);

// Parse command line arguments
program.parse(); 
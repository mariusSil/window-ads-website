import { marked } from 'marked';

// Configure marked options for better formatting
marked.setOptions({
  breaks: true,
  gfm: true
});

/**
 * Process markdown content and convert to HTML with custom styling classes
 */
export function processMarkdownContent(content: string): string {
  if (!content) return '';
  
  try {
    // Convert markdown to HTML
    let html = marked(content) as string;
    
    // Add custom Tailwind classes for proper styling
    html = html
      // Headings
      .replace(/<h1>/g, '<h1 class="text-2xl font-bold text-secondary mb-6 mt-8">')
      .replace(/<h2>/g, '<h2 class="text-xl font-semibold text-secondary mb-4 mt-6">')
      .replace(/<h3>/g, '<h3 class="text-lg font-semibold text-secondary mb-3 mt-5">')
      .replace(/<h4>/g, '<h4 class="text-base font-medium text-secondary mb-2 mt-4">')
      .replace(/<h5>/g, '<h5 class="text-sm font-medium text-secondary mb-2 mt-3">')
      .replace(/<h6>/g, '<h6 class="text-sm font-medium text-neutral-700 mb-2 mt-3">')
      
      // Lists
      .replace(/<ul>/g, '<ul class="list-disc list-inside space-y-2 mb-6 ml-4">')
      .replace(/<ol>/g, '<ol class="list-decimal list-inside space-y-2 mb-6 ml-4">')
      .replace(/<li>/g, '<li class="text-neutral-700 leading-relaxed">')
      
      // Paragraphs
      .replace(/<p>/g, '<p class="text-neutral-700 mb-4 leading-relaxed">')
      
      // Text formatting
      .replace(/<strong>/g, '<strong class="font-semibold text-secondary">')
      .replace(/<em>/g, '<em class="italic text-neutral-800">')
      
      // Code blocks
      .replace(/<pre><code>/g, '<pre class="bg-neutral-100 rounded-lg p-4 mb-4 overflow-x-auto"><code class="text-sm text-neutral-800">')
      .replace(/<\/code><\/pre>/g, '</code></pre>')
      .replace(/<code>/g, '<code class="bg-neutral-100 px-2 py-1 rounded text-sm text-neutral-800">')
      
      // Blockquotes
      .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-primary pl-4 py-2 mb-4 bg-neutral-50 rounded-r-lg">')
      .replace(/<blockquote><p>/g, '<blockquote class="border-l-4 border-primary pl-4 py-2 mb-4 bg-neutral-50 rounded-r-lg"><p class="text-neutral-700 italic mb-0">')
      
      // Tables
      .replace(/<table>/g, '<table class="w-full border-collapse border border-neutral-300 mb-6">')
      .replace(/<th>/g, '<th class="border border-neutral-300 px-4 py-2 bg-neutral-100 font-semibold text-left">')
      .replace(/<td>/g, '<td class="border border-neutral-300 px-4 py-2 text-neutral-700">')
      
      // Links
      .replace(/<a /g, '<a class="text-primary hover:text-primary-dark underline" ');
    
    return html;
  } catch (error) {
    console.error('Error processing markdown content:', error);
    return content; // Return original content if processing fails
  }
}

/**
 * Process content with special callout boxes for tips, warnings, etc.
 */
export function processContentWithCallouts(content: string, callouts?: {
  tips?: string[];
  benefits?: string[];
  warning?: string;
  callout?: string;
}): string {
  let processedContent = processMarkdownContent(content);
  
  if (!callouts) return processedContent;
  
  // Add tips section
  if (callouts.tips && callouts.tips.length > 0) {
    const tipsHtml = `
      <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
        <div class="flex items-center mb-2">
          <svg class="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
          <h4 class="text-blue-800 font-medium">Professional Tips</h4>
        </div>
        <ul class="list-disc list-inside space-y-1 text-blue-700">
          ${callouts.tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>
    `;
    processedContent += tipsHtml;
  }
  
  // Add benefits section
  if (callouts.benefits && callouts.benefits.length > 0) {
    const benefitsHtml = `
      <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
        <div class="flex items-center mb-2">
          <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <h4 class="text-green-800 font-medium">Key Benefits</h4>
        </div>
        <ul class="list-disc list-inside space-y-1 text-green-700">
          ${callouts.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
        </ul>
      </div>
    `;
    processedContent += benefitsHtml;
  }
  
  // Add warning section
  if (callouts.warning) {
    const warningHtml = `
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
        <div class="flex items-center mb-2">
          <svg class="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <h4 class="text-yellow-800 font-medium">Important Warning</h4>
        </div>
        <p class="text-yellow-700">${callouts.warning}</p>
      </div>
    `;
    processedContent += warningHtml;
  }
  
  // Add professional callout
  if (callouts.callout) {
    const calloutHtml = `
      <div class="bg-primary-50 border-l-4 border-primary p-4 mb-6 rounded-r-lg">
        <div class="flex items-center mb-2">
          <svg class="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
          </svg>
          <h4 class="text-primary-dark font-medium">Professional Insight</h4>
        </div>
        <p class="text-primary-dark">${callouts.callout}</p>
      </div>
    `;
    processedContent += calloutHtml;
  }
  
  return processedContent;
}

'use client';

import { useState } from 'react';
import DocsLeftSidebar from "@/components/docs/DocsLeftSidebar";
import DocsOnThisPage from "@/components/docs/DocsOnThisPage";
import DocsContent from "@/components/docs/DocsContent";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Check, 
  Info, 
  Code,
  Zap,
  Lightbulb,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function CustomActionsPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyPage = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <DocsLeftSidebar />

          <div className="lg:col-span-7">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs font-semibold text-muted-foreground mb-2">Actions</div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Custom Actions</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">
                  Write custom JavaScript functions to create powerful, flexible actions. Custom actions enable complex logic, data transformations, and multi-step workflows.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPage}
                  className="rounded-lg"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy page
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Content */}
            <DocsContent>
              <h2 id="what-are-custom-actions">What Are Custom Actions?</h2>
              <p>
                Custom actions are JavaScript functions that you write to perform complex operations. Unlike webhook actions, custom actions run server-side and can:
              </p>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Perform complex data transformations</li>
                <li>Make multiple API calls in sequence</li>
                <li>Implement conditional logic and branching</li>
                <li>Process and validate data</li>
                <li>Integrate with databases</li>
                <li>Handle complex error scenarios</li>
              </ul>

              <h2 id="function-structure">Function Structure</h2>
              <p>Every custom action must export an async function:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`async function executeAction(params) {
  // Your code here
  return {
    success: true,
    data: result
  };
}`}</code></pre>
              </div>

              <h3 id="parameters">Parameters</h3>
              <p>The <code>params</code> object contains all input parameters defined in your action configuration:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`async function executeAction(params) {
  const { email, name, message } = params;
  
  // Use the parameters
  console.log(\`Processing request from \${name} (\${email})\`);
  
  // Your logic here
}`}</code></pre>
              </div>

              <h3 id="return-value">Return Value</h3>
              <p>Your function must return an object with:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>success:</strong> Boolean indicating if the action succeeded</li>
                <li><strong>data:</strong> The result data (optional if success is false)</li>
                <li><strong>error:</strong> Error message (optional, used when success is false)</li>
              </ul>

              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`// Success response
return {
  success: true,
  data: {
    message: "Action completed successfully",
    result: processedData
  }
};

// Error response
return {
  success: false,
  error: "Failed to process request: " + error.message
};`}</code></pre>
              </div>

              <h2 id="examples">Examples</h2>
              
              <h3 id="example-1">Example 1: Data Transformation</h3>
              <p>Transform and validate user input:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`async function executeAction(params) {
  try {
    const { email, phone, name } = params;
    
    // Validate email
    if (!email || !email.includes('@')) {
      return {
        success: false,
        error: 'Invalid email address'
      };
    }
    
    // Format phone number
    const formattedPhone = phone.replace(/[^0-9]/g, '');
    
    // Transform data
    const transformedData = {
      contact: {
        email: email.toLowerCase().trim(),
        phone: formattedPhone,
        fullName: name.trim(),
        createdAt: new Date().toISOString()
      }
    };
    
    return {
      success: true,
      data: transformedData
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}`}</code></pre>
              </div>

              <h3 id="example-2">Example 2: Multiple API Calls</h3>
              <p>Make sequential API calls:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`async function executeAction(params) {
  try {
    const { email, name } = params;
    
    // Step 1: Create user in database
    const userResponse = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to create user');
    }
    
    const user = await userResponse.json();
    
    // Step 2: Send welcome email
    const emailResponse = await fetch('https://api.example.com/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: 'Welcome!',
        template: 'welcome',
        userId: user.id
      })
    });
    
    return {
      success: true,
      data: {
        userId: user.id,
        emailSent: emailResponse.ok
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}`}</code></pre>
              </div>

              <h3 id="example-3">Example 3: Conditional Logic</h3>
              <p>Implement branching logic based on conditions:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`async function executeAction(params) {
  try {
    const { orderAmount, customerTier } = params;
    
    let discount = 0;
    let shippingCost = 10;
    
    // Apply discount based on customer tier
    if (customerTier === 'premium') {
      discount = orderAmount * 0.15; // 15% discount
      shippingCost = 0; // Free shipping
    } else if (customerTier === 'gold') {
      discount = orderAmount * 0.10; // 10% discount
      shippingCost = 5; // Reduced shipping
    }
    
    // Free shipping for orders over $100
    if (orderAmount > 100) {
      shippingCost = 0;
    }
    
    const finalAmount = orderAmount - discount + shippingCost;
    
    return {
      success: true,
      data: {
        originalAmount: orderAmount,
        discount,
        shippingCost,
        finalAmount
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}`}</code></pre>
              </div>

              <h2 id="available-apis">Available APIs</h2>
              <p>Custom actions have access to:</p>
              <ul className="ml-4 mt-2 space-y-2">
                <li><strong>fetch:</strong> Make HTTP requests to external APIs</li>
                <li><strong>Date:</strong> Date and time manipulation</li>
                <li><strong>JSON:</strong> JSON parsing and stringification</li>
                <li><strong>Math:</strong> Mathematical operations</li>
                <li><strong>String/Array methods:</strong> Standard JavaScript methods</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-amber-50/50 dark:bg-amber-500/10 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Note:</strong> Custom actions run in a sandboxed environment. File system access, certain Node.js modules, and browser APIs are not available.
                </div>
              </div>

              <h2 id="error-handling">Error Handling</h2>
              <p>Always wrap your code in try-catch blocks:</p>
              <div className="my-4 rounded-lg border bg-muted/40 p-4">
                <pre className="text-sm overflow-x-auto"><code>{`async function executeAction(params) {
  try {
    // Your code here
    return { success: true, data: result };
  } catch (error) {
    // Log error details for debugging
    console.error('Action error:', error);
    
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}`}</code></pre>
              </div>

              <h2 id="best-practices">Best Practices</h2>
              <ul className="ml-4 mt-2 space-y-2">
                <li>Always validate input parameters</li>
                <li>Use try-catch for error handling</li>
                <li>Return meaningful error messages</li>
                <li>Keep functions focused and single-purpose</li>
                <li>Add comments for complex logic</li>
                <li>Test thoroughly with various inputs</li>
                <li>Handle edge cases and null values</li>
                <li>Use async/await for asynchronous operations</li>
                <li>Set reasonable timeouts for API calls</li>
              </ul>

              <div className="my-4 px-5 py-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-500/10 flex gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Tip:</strong> Start simple and add complexity gradually. Test each part of your function independently before combining them.
                </div>
              </div>

              <h2 id="testing">Testing Custom Actions</h2>
              <p>Use the built-in test feature:</p>
              <ol className="ml-4 mt-2 space-y-2">
                <li>Write your function in the code editor</li>
                <li>Click &quot;Test Action&quot;</li>
                <li>Provide sample parameter values</li>
                <li>Review the execution logs</li>
                <li>Check the return value</li>
                <li>Fix any errors and test again</li>
              </ol>

              <h2 id="next-steps">Next Steps</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Link href="/docs/actions/create" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Create Actions</h3>
                      <p className="text-sm text-muted-foreground mt-1">Step-by-step creation guide</p>
                    </div>
                  </div>
                </Link>
                <Link href="/docs/actions/webhook" className="block rounded-lg border p-4 hover:border-foreground transition-colors">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Webhook Actions</h3>
                      <p className="text-sm text-muted-foreground mt-1">For simpler integrations</p>
                    </div>
                  </div>
                </Link>
              </div>
            </DocsContent>
          </div>

          <DocsOnThisPage
            items={[
              { id: "what-are-custom-actions", label: "What Are Custom Actions?" },
              { id: "function-structure", label: "Function Structure" },
              { id: "examples", label: "Examples" },
              { id: "available-apis", label: "Available APIs" },
              { id: "error-handling", label: "Error Handling" },
              { id: "best-practices", label: "Best Practices" },
              { id: "testing", label: "Testing" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}


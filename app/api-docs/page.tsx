'use client';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <span className="text-2xl">🌾</span>
        <div>
          <h1 className="text-xl font-bold text-gray-900">FarmPOS API Documentation</h1>
          <p className="text-sm text-gray-500">Interactive API explorer powered by Swagger UI</p>
        </div>
      </div>
      <SwaggerUI url="/api/swagger" docExpansion="list" />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseTest: React.FC = () => {
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkTableSchema();
  }, []);

  const checkTableSchema = async () => {
    try {
      setLoading(true);
      
      // Try to query the table directly to see what columns exist
      const { data: sampleData, error: sampleError } = await supabase
        .from('students')
        .select('*')
        .limit(1);

      if (sampleError) {
        throw sampleError;
      }

      // Get column names from the first row
      if (sampleData && sampleData.length > 0) {
        const columns = Object.keys(sampleData[0]);
        setTableInfo({
          columns,
          sampleRow: sampleData[0],
          message: 'Retrieved column information from sample data'
        });
      } else {
        setTableInfo({
          columns: [],
          message: 'Table exists but has no data'
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check table schema');
    } finally {
      setLoading(false);
    }
  };

  const testGenderField = async () => {
    try {
      // Try to insert a test record with gender field
      const { data, error } = await supabase
        .from('students')
        .insert({
          name: 'Test Student',
          email: 'test@example.com',
          phone: '123-456-7890',
          date_of_birth: '2010-01-01',
          gender: 'male',
          program_id: 1,
          status: 'active',
          enrollment_date: new Date().toISOString().split('T')[0],
          notes: 'Test record to check gender field'
        })
        .select()
        .single();

      if (error) {
        setError(`Gender field test failed: ${error.message}`);
      } else {
        setTableInfo(prev => ({
          ...prev,
          genderTest: 'SUCCESS - Gender field exists and accepts data',
          testRecord: data
        }));
      }
    } catch (err) {
      setError(`Gender field test error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const cleanupTestRecord = async () => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('name', 'Test Student');

      if (error) {
        setError(`Cleanup failed: ${error.message}`);
      } else {
        setTableInfo(prev => ({
          ...prev,
          cleanup: 'Test record removed successfully'
        }));
      }
    } catch (err) {
      setError(`Cleanup error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="p-4">Checking database schema...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supabase Database Schema Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {tableInfo && (
        <div className="space-y-4">
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            <strong>Status:</strong> {tableInfo.message}
          </div>

          {tableInfo.columns && (
            <div className="bg-gray-100 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">Current Table Columns:</h2>
              <ul className="list-disc list-inside space-y-1">
                {tableInfo.columns.map((column: string) => (
                  <li key={column} className="font-mono">{column}</li>
                ))}
              </ul>
            </div>
          )}

          {tableInfo.sampleRow && (
            <div className="bg-gray-100 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">Sample Row Data:</h2>
              <pre className="bg-white p-2 rounded text-sm overflow-auto">
                {JSON.stringify(tableInfo.sampleRow, null, 2)}
              </pre>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={testGenderField}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Test Gender Field
            </button>
            
            {tableInfo.testRecord && (
              <button
                onClick={cleanupTestRecord}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
              >
                Cleanup Test Record
              </button>
            )}
          </div>

          {tableInfo.genderTest && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <strong>Gender Field Test:</strong> {tableInfo.genderTest}
            </div>
          )}

          {tableInfo.cleanup && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              <strong>Cleanup:</strong> {tableInfo.cleanup}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <strong>Note:</strong> This component tests whether the gender field exists in your Supabase students table. 
        If the gender field doesn't exist, you'll need to add it via a database migration.
      </div>
    </div>
  );
};

export default SupabaseTest;


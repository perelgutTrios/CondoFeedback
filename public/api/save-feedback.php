<?php
/**
 * Essex Feedback Portal - Server-side CSV Storage
 * Simple PHP script to append feedback submissions to a CSV file
 * Compatible with XAMPP and most web servers
 */

// Enable CORS for localhost development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

try {
    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('Invalid JSON data');
    }
    
    // Define CSV file path (outside web root for security)
    $csvDir = dirname(__DIR__, 2) . '/data/';
    $csvFile = $csvDir . 'essex-feedback.csv';
    
    // Create data directory if it doesn't exist
    if (!file_exists($csvDir)) {
        if (!mkdir($csvDir, 0755, true)) {
            throw new Exception('Failed to create data directory');
        }
    }
    
    // Prepare CSV data with timestamp
    $timestamp = date('Y-m-d H:i:s');
    $submissionId = uniqid('feedback_', true);
    
    $csvRow = [
        $timestamp,
        $submissionId,
        $data['lastName'] ?? 'N/A',
        $data['unitNumber'] ?? 'N/A', 
        $data['topics'] ?? 'N/A',
        $data['urgency'] ?? 'N/A',
        $data['subject'] ?? 'N/A',
        str_replace(["\r", "\n"], ' ', $data['comment'] ?? 'N/A'), // Remove line breaks
        $data['email'] ?? '',
        $data['isAnonymous'] ? 'Yes' : 'No',
        $data['copyPM'] ? 'Yes' : 'No',
        $data['copyMe'] ? 'Yes' : 'No',
        $data['buttonType'] ?? 'General Submit'
    ];
    
    // Check if file exists, if not create with headers
    $fileExists = file_exists($csvFile);
    
    // Open file for appending
    $handle = fopen($csvFile, 'a');
    if (!$handle) {
        throw new Exception('Cannot open CSV file for writing');
    }
    
    // Add headers if new file
    if (!$fileExists) {
        $headers = [
            'Timestamp',
            'Submission ID', 
            'Last Name',
            'Unit Number',
            'Topics',
            'Urgency', 
            'Subject',
            'Comment',
            'Email',
            'Anonymous',
            'Copy PM',
            'Copy Me',
            'Submit Type'
        ];
        fputcsv($handle, $headers);
    }
    
    // Append the new row
    if (fputcsv($handle, $csvRow) === false) {
        throw new Exception('Failed to write CSV data');
    }
    
    fclose($handle);
    
    // Get total count
    $lineCount = 0;
    if ($fileExists) {
        $lineCount = count(file($csvFile)) - 1; // Subtract header row
    }
    
    // Return success response
    echo json_encode([
        'success' => true,
        'id' => $submissionId,
        'timestamp' => $timestamp,
        'totalSubmissions' => $lineCount,
        'message' => 'Feedback saved successfully to server'
    ]);
    
} catch (Exception $e) {
    error_log('Feedback save error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
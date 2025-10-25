<?php
/**
 * Essex Feedback Portal - Admin CSV Access
 * Simple admin interface to view and download feedback submissions
 */

// Simple password protection
$adminPassword = 'EssexPM'; // Same as client-side admin password
$isAuthenticated = false;

if (isset($_POST['password'])) {
    if ($_POST['password'] === $adminPassword) {
        $isAuthenticated = true;
        setcookie('admin_auth', hash('sha256', $adminPassword . date('Y-m-d')), time() + 1800); // 30 min
    }
}

if (isset($_COOKIE['admin_auth']) && $_COOKIE['admin_auth'] === hash('sha256', $adminPassword . date('Y-m-d'))) {
    $isAuthenticated = true;
}

// Define CSV file path
$csvDir = dirname(__DIR__, 3) . '/data/';
$csvFile = $csvDir . 'essex-feedback.csv';

// Handle download request
if ($isAuthenticated && isset($_GET['download'])) {
    if (file_exists($csvFile)) {
        $filename = 'essex-feedback-' . date('Y-m-d') . '.csv';
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Content-Length: ' . filesize($csvFile));
        readfile($csvFile);
        exit();
    } else {
        $error = 'No feedback data found';
    }
}

// Handle clear data request
if ($isAuthenticated && isset($_POST['clear_data']) && $_POST['confirm_clear'] === 'DELETE') {
    if (file_exists($csvFile)) {
        if (unlink($csvFile)) {
            $message = 'All feedback data has been cleared';
        } else {
            $error = 'Failed to clear data';
        }
    }
}

// Get submission count
$submissionCount = 0;
$lastSubmission = 'None';
if (file_exists($csvFile)) {
    $lines = file($csvFile);
    $submissionCount = count($lines) - 1; // Subtract header
    if ($submissionCount > 0) {
        $lastLine = end($lines);
        $lastData = str_getcsv($lastLine);
        $lastSubmission = $lastData[0] ?? 'Unknown';
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Essex Feedback - Admin Panel</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: #003366;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
            margin: -30px -30px 20px -30px;
        }
        .stats {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .stats h3 {
            margin-top: 0;
            color: #003366;
        }
        .button {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
            text-decoration: none;
            display: inline-block;
        }
        .button.danger {
            background: #dc3545;
        }
        .button:hover {
            opacity: 0.9;
        }
        .login-form {
            text-align: center;
            padding: 40px;
        }
        .login-form input {
            padding: 10px;
            margin: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 200px;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .success {
            background: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .clear-section {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏢 Essex Feedback Portal</h1>
            <h2>Admin Panel - Server CSV Access</h2>
        </div>

        <?php if (!$isAuthenticated): ?>
            <div class="login-form">
                <h3>🔒 Admin Access Required</h3>
                <form method="POST">
                    <input type="password" name="password" placeholder="Enter admin password" required>
                    <br>
                    <button type="submit" class="button">Login</button>
                </form>
                <?php if (isset($_POST['password'])): ?>
                    <div class="error">❌ Invalid password</div>
                <?php endif; ?>
            </div>
        <?php else: ?>
            
            <?php if (isset($error)): ?>
                <div class="error">❌ <?= htmlspecialchars($error) ?></div>
            <?php endif; ?>
            
            <?php if (isset($message)): ?>
                <div class="success">✅ <?= htmlspecialchars($message) ?></div>
            <?php endif; ?>

            <div class="stats">
                <h3>📊 Submission Statistics</h3>
                <p><strong>Total Submissions:</strong> <?= $submissionCount ?></p>
                <p><strong>Last Submission:</strong> <?= htmlspecialchars($lastSubmission) ?></p>
                <p><strong>CSV File Location:</strong> <code><?= htmlspecialchars($csvFile) ?></code></p>
                <p><strong>File Size:</strong> <?= file_exists($csvFile) ? number_format(filesize($csvFile)) . ' bytes' : 'N/A' ?></p>
            </div>

            <div style="text-align: center; margin: 20px 0;">
                <?php if ($submissionCount > 0): ?>
                    <a href="?download=1" class="button">📊 Download CSV File</a>
                    <a href="admin.php" class="button" style="background: #007bff;">🔄 Refresh Data</a>
                <?php else: ?>
                    <p>No feedback submissions found.</p>
                <?php endif; ?>
            </div>

            <?php if ($submissionCount > 0): ?>
                <div class="clear-section">
                    <h3>⚠️ Danger Zone</h3>
                    <p>Clear all feedback data permanently. This action cannot be undone.</p>
                    <form method="POST" onsubmit="return confirm('Are you sure you want to delete ALL feedback data? This cannot be undone!');">
                        <input type="hidden" name="clear_data" value="1">
                        <input type="text" name="confirm_clear" placeholder="Type DELETE to confirm" required style="margin: 10px 0;">
                        <br>
                        <button type="submit" class="button danger">🗑️ Clear All Data</button>
                    </form>
                </div>
            <?php endif; ?>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
                <p><strong>Access Instructions:</strong></p>
                <ul style="text-align: left; display: inline-block;">
                    <li>CSV file is stored outside web root for security</li>
                    <li>Data persists across browser sessions and devices</li>
                    <li>Compatible with Excel, Google Sheets, and other CSV tools</li>
                    <li>Automatic backup - download regularly for safety</li>
                </ul>
            </div>

        <?php endif; ?>
    </div>
</body>
</html>
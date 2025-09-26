
1. 
```sh
https://dev-ui.worko.work/evaluator-dashboard/?evaluatorRequestId=01JXCX94YWC8RNY015TMPYVVDJ
```
2. List of `job applications/applicants details` for single `evaluator`
   [GET] `https://jobs.dev.worko.work/request-evaluation/?pageSize=25&sortOrder=descending&evaluatorRequestId=01JXCX94YWC8RNY015TMPYVVDJ`
   ```json
   {
    "data":[
        {
            "applicantUserEmail":"...", // https://api.dev.worko.work/user/<applicantUserEmail>/details
            "jobApplicationId":"...",
            "jobId":"...",
            "companyId":"...",
        },
        {},
        {},
        {},
    ],
    "pagination":{
        // ..
    }
   }
   ```

3. https://liveweave.com/

```sh
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Candidate Evaluation Request</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 15px rgba(0, 123, 255, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #007bff 0%, #71f8f8 100%);
            padding: 25px 20px;
            text-align: center;
            color: white;
        }
        
        .header h1 {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .header p {
            font-size: 14px;
            opacity: 0.95;
        }
        
        .content {
            padding: 30px 25px;
        }
        
        .greeting {
            font-size: 16px;
            color: #182b45;
            margin-bottom: 15px;
            font-weight: 500;
        }
        
        .message {
            font-size: 15px;
            color: #555;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        
        .candidates-section {
            margin: 25px 0;
        }
        
        .section-title {
            color: #182b45;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            border-bottom: 2px solid #71f8f8;
            padding-bottom: 5px;
        }
        
        .candidate-card {
            background: #f8fbff;
            border: 1px solid #e3f2fd;
            border-left: 4px solid #71f8f8;
            border-radius: 8px;
            padding: 12px 15px;
            margin: 8px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .candidate-info {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
        }
        
        .candidate-avatar {
            width: 35px;
            height: 35px;
            background: linear-gradient(135deg, #007bff, #71f8f8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            color: white;
        }
        
        .candidate-details h4 {
            color: #182b45;
            font-size: 14px;
            margin-bottom: 2px;
            font-weight: 600;
        }
        
        .candidate-details p {
            color: #666;
            font-size: 12px;
        }
        
        .match-score {
            text-align: center;
            min-width: 60px;
        }
        
        .score-label {
            display: block;
            font-size: 10px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .score-value {
            display: block;
            font-size: 16px;
            font-weight: bold;
            color: #007bff;
        }
        
        .view-more {
            text-align: center;
            padding: 15px;
            background: linear-gradient(135deg, #f0f8ff, #e3f2fd);
            border-radius: 8px;
            margin-top: 10px;
        }
        
        .view-more p {
            color: #007bff;
            font-size: 14px;
            font-weight: 500;
        }
        
        .cta-section {
            text-align: center;
            margin: 25px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #007bff, #71f8f8);
            color: white;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 6px;
            font-size: 15px;
            font-weight: 600;
            transition: transform 0.2s ease;
            box-shadow: 0 3px 12px rgba(0, 123, 255, 0.25);
        }
        
        .cta-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(0, 123, 255, 0.35);
        }
        
        .evaluation-info {
            background: #f8fbff;
            border-radius: 8px;
            padding: 18px;
            margin: 20px 0;
        }
        
        .evaluation-info h4 {
            color: #182b45;
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .eval-list {
            list-style: none;
            margin: 0;
        }
        
        .eval-list li {
            padding: 4px 0;
            color: #666;
            font-size: 13px;
            position: relative;
            padding-left: 15px;
        }
        
        .eval-list li:before {
            content: "•";
            color: #71f8f8;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        .footer {
            background: #f8fbff;
            color: #666;
            padding: 20px 25px;
            text-align: center;
            border-top: 1px solid #e3f2fd;
        }
        
        .footer p {
            margin-bottom: 5px;
            font-size: 13px;
        }
        
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .content {
                padding: 20px 15px;
            }
            
            .candidate-info {
                flex-direction: row;
                gap: 8px;
            }
            
            .candidate-card {
                padding: 10px 12px;
            }
            
            .match-score {
                min-width: 50px;
            }
        }
        </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>Candidate Evaluation Request</h1>
            <p>Review and assess top candidates</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hi {Hiring Manager's Name},
            </div>
            
            <div class="message">
               Hope you're doing well! I've come across a candidate for the {Role Title} role who seems like a strong fit based on our initial discussion and requirements.<br>
Sharing the profile below for your review — would appreciate your quick feedback so we can move ahead accordingly. Looking forward to your thoughts.
            </div>
            
            <!-- Candidates Section -->
            <div class="candidates-section">
                <div class="section-title">Candidates for Review</div>
                
                <div class="candidate-card">
                    <div class="candidate-info">
                        <div class="candidate-avatar">JD</div>
                        <div class="candidate-details">
                            <h4>John Doe</h4>
                            <p>Senior Software Engineer</p>
                        </div>
                    </div>
                    <div class="match-score">
                        <span class="score-label">Match</span>
                        <span class="score-value">95%</span>
                    </div>
                </div>
                
                <div class="candidate-card">
                    <div class="candidate-info">
                        <div class="candidate-avatar">SM</div>
                        <div class="candidate-details">
                            <h4>Sarah Miller</h4>
                            <p>Frontend Developer</p>
                        </div>
                    </div>
                    <div class="match-score">
                        <span class="score-label">Match</span>
                        <span class="score-value">92%</span>
                    </div>
                </div>
                
                <div class="candidate-card">
                    <div class="candidate-info">
                        <div class="candidate-avatar">RJ</div>
                        <div class="candidate-details">
                            <h4>Robert Johnson</h4>
                            <p>Full Stack Developer</p>
                        </div>
                    </div>
                    <div class="match-score">
                        <span class="score-label">Match</span>
                        <span class="score-value">88%</span>
                    </div>
                </div>
                
                <div class="candidate-card">
                    <div class="candidate-info">
                        <div class="candidate-avatar">EW</div>
                        <div class="candidate-details">
                            <h4>Emily Wilson</h4>
                            <p>UI/UX Developer</p>
                        </div>
                    </div>
                    <div class="match-score">
                        <span class="score-label">Match</span>
                        <span class="score-value">85%</span>
                    </div>
                </div>
                
                <div class="candidate-card">
                    <div class="candidate-info">
                        <div class="candidate-avatar">MC</div>
                        <div class="candidate-details">
                            <h4>Michael Chen</h4>
                            <p>Backend Developer</p>
                        </div>
                    </div>
                    <div class="match-score">
                        <span class="score-label">Match</span>
                        <span class="score-value">82%</span>
                    </div>
                </div>
                
                <div class="view-more">
                    <p>+ 15 more candidates awaiting your review</p>
                </div>
            </div>
            
            <!-- Call to Action -->
            <div class="cta-section">
                <a href="[EVALUATION_LINK]" class="cta-button">
                    Review Candidates
                </a>
            </div>
            
            <div class="evaluation-info">
                <h4>Quick evaluation checklist:</h4>
                <ul class="eval-list">
                    <li>Technical skills match</li>
                    <li>Experience relevance</li>
                    <li>Team fit assessment</li>
                    <li>Your overall recommendation</li>
                </ul>
            </div>
            
            <div class="message" style="font-size: 13px; color: #888; text-align: center; margin-top: 25px;">
                Thanks for taking the time to help with this! Let me know if you have any questions.
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>Best regards,</p>
            <p><strong>[HR_NAME]</strong> - HR Team</p>
            <p>[COMPANY_NAME]</p>
        </div>
    </div>
</body>
</html>
```
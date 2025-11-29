import os

# Paths
logo_path = '/Users/saeed/Desktop/score\'n---showcase-skills (2)/logo_baked_b64.txt'
circle_path = '/Users/saeed/Desktop/score\'n---showcase-skills (2)/circle_b64.txt' # Reuse existing circle
target_path = '/Users/saeed/.gemini/antigravity/brain/a1813811-7add-456d-a9d0-c3eb9260a111/google_apps_script.js'

# Read base64 content
with open(logo_path, 'r') as f:
    logo_b64 = f.read().strip()

with open(circle_path, 'r') as f:
    circle_b64 = f.read().strip()

# Construct the script content
script_content = f"""// 1. Go to your Google Sheet > Extensions > Apps Script
// 2. Replace ALL code with this new version.
// 3. Click Deploy > Manage Deployments > Edit (Pencil) > New Version > Deploy.
// IMPORTANT: You MUST have "register@scoren.pro" set up as a "Send mail as" alias in the Gmail account running this script.

function doPost(e) {{
  try {{
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // --- 1. Save to Google Sheet ---
    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.region,
      data.school,
      data.position,
      data.age,
      data.height,
      data.foot,
      data.heatmap,
      "Processed"
    ]);

    // --- 2. Decode Image ---
    const base64Data = data.image.split(',')[1];
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), MimeType.PNG, "PlayerCard.png");

    // Define Icons (PNG Base64)
    const circleIconB64 = "{circle_b64}";
    const netLogoB64 = "{logo_b64}";

    // --- 3. Send Email with Inline Image ---
    const emailBody = `
      <div style="font-family: 'Courier New', monospace; background-color: #050f0d; color: white; padding: 40px; text-align: center;">
        <!-- Logo Header -->
        <div style="margin-bottom: 30px; text-align: center;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                    <td style="font-family: sans-serif; font-weight: 900; font-size: 32px; letter-spacing: 0.1em; color: white; vertical-align: middle;">SC</td>
                    <td style="vertical-align: middle; padding: 0 2px;">
                        <img src="cid:circleIcon" style="width: 28px; height: 28px; display: block;" />
                    </td>
                    <td style="font-family: sans-serif; font-weight: 900; font-size: 32px; letter-spacing: 0.1em; color: white; vertical-align: middle;">RE'</td>
                    <td style="vertical-align: middle; padding: 0;">
                        <img src="cid:netLogo" style="width: 36px; height: 36px; display: block; margin-left: -4px; position: relative; top: 2px;" />
                    </td>
                </tr>
            </table>
        </div>

        <h1 style="color: #B4F156; font-family: sans-serif; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; font-size: 24px;">ID Confirmed</h1>
        <p style="color: #888; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin-bottom: 30px;">Welcome to the Squad</p>
        
        <div style="margin-bottom: 30px; display: flex; justify-content: center;">
          <img src="cid:cardImage" style="display: block; margin: 0 auto; width: 100%; max-width: 340px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
        </div>
        
        <div style="margin-top: 20px;">
          <a href="https://wallet.apple.com/" style="background-color: #000000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; border: 1px solid #333; display: inline-block;">
            Add to Apple Wallet
          </a>
        </div>
        
        <p style="margin-top: 40px; font-size: 10px; color: #444;">SCORE'N REGISTRY // V.2.0</p>
      </div>
    `;

    GmailApp.sendEmail(data.email, "Your Official Score'n Player Card", "", {{
      htmlBody: emailBody,
      inlineImages: {{
        cardImage: blob,
        circleIcon: Utilities.newBlob(Utilities.base64Decode(circleIconB64), MimeType.PNG, "circle.png"),
        netLogo: Utilities.newBlob(Utilities.base64Decode(netLogoB64), MimeType.PNG, "logo.png")
      }},
      from: "register@scoren.pro", // MUST be configured in Gmail settings
      name: "Score'n Registry"
    }});

    return ContentService.createTextOutput(JSON.stringify({{ status: "success", message: "Card processed and emailed" }}))
      .setMimeType(ContentService.MimeType.JSON);

  }} catch (error) {{
    return ContentService.createTextOutput(JSON.stringify({{ status: "error", message: error.toString() }}))
      .setMimeType(ContentService.MimeType.JSON);
  }}
}}

function testAuth() {{
  GmailApp.getInboxThreads(0, 1);
  console.log("Gmail permission granted!");
}}
"""

with open(target_path, 'w') as f:
    f.write(script_content)

print("Updated script with baked logo.")

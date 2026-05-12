# Dashboard Screenshot

## How to Add the Screenshot

1. **Save the dashboard screenshot** you captured:
   - Right-click on the screenshot image → **Save image as...**
   - Navigate to the `docs/` folder in the project
   - Name it `dashboard-screenshot.png`

2. **Verify the path:**
   ```
   d:\project\docs\dashboard-screenshot.png
   ```

3. **Commit to Git (optional):**
   ```bash
   git add docs/dashboard-screenshot.png
   git commit -m "Add dashboard screenshot to documentation"
   ```

The README will automatically display the image once the file is in place.

## Screenshot Details

The screenshot shows:
- **5 Service Cards** (User, Product, Order, Payment, Notification)
- Each with **UP status** badge (green)
- **Ping Service buttons** for testing each endpoint
- JSON response display for each service
- **Inter-service Communication** section showing:
  - Order Service communication with Product & Payment Services
  - Payment Service communication with Notification Service

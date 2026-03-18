const express = require('express');
const router = express.Router();

// Mock 2D Preview Endpoint
router.post('/preview/2d', (req, res) => {
    // In the future this will communicate with the Python Flask service
    res.json({
        success: true,
        message: "2D Mockup generated successfully (STUB)",
        mockupUrl: "https://via.placeholder.com/400x400.png?text=2D+Mockup",
        metadata: {
            processingTime: "0.45s",
            modelUsed: "fine-tuned-2d-v1"
        }
    });
});

// Mock 3D Render Endpoint
router.post('/preview/3d', (req, res) => {
    // In the future this will communicate with the Python Flask service
    res.json({
        success: true,
        message: "3D Render generated successfully (STUB)",
        modelUrl: "https://example.com/mock-3d-model.glb",
        metadata: {
            processingTime: "2.1s",
            modelUsed: "fine-tuned-3d-v2"
        }
    });
});

// Mock Design Suggestion Endpoint
router.post('/suggest', (req, res) => {
    // In the future this will communicate with the Python Flask service
    res.json({
        success: true,
        message: "Suggestions generated successfully (STUB)",
        suggestions: [
            "Consider adding more contrast to the text.",
            "The center graphic might clip during printing if placed lower.",
            "This design pairs well with dark-colored fabrics."
        ]
    });
});

module.exports = router;

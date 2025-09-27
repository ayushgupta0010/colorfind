from PIL import Image
import numpy as np

# ---- Matrices used in common daltonize implementations ----
# RGB <-> LMS conversion matrices (normalized)
RGB_TO_LMS = np.array([
    [0.31399022, 0.63951294, 0.04649755],
    [0.15537241, 0.75789446, 0.08670142],
    [0.01775239, 0.10944209, 0.87256922]
], dtype=np.float64)

LMS_TO_RGB = np.linalg.inv(RGB_TO_LMS)

# LMS confusion matrices approximating the effect of each CVD
# These are commonly-used approximation matrices.
CVD_MATRICES = {
    'protan': np.array([
        [0.0, 1.05118294, -0.05116099],
        [0.0, 1.0,         0.0       ],
        [0.0, 0.0,         1.0       ]
    ], dtype=np.float64),

    'deutan': np.array([
        [1.0,         0.0, 0.0       ],
        [0.9513092,   0.0, 0.04866992],
        [0.0,         0.0, 1.0       ]
    ], dtype=np.float64),

    'tritan': np.array([
        [1.0,         0.0,         0.0       ],
        [0.0,         1.0,         0.0       ],
        [-0.86744736, 1.86727089,  0.0       ]
    ], dtype=np.float64)
}

def _img_to_array(img: Image.Image) -> np.ndarray:
    """Return float array in shape (H, W, 3) scaled 0..1."""
    arr = np.asarray(img.convert('RGB'), dtype=np.float64) / 255.0
    return arr

def _array_to_img(arr: np.ndarray) -> Image.Image:
    """Convert float array (0..1) to PIL Image (uint8). Clips values."""
    arr = np.clip(arr * 255.0, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)

def rgb_to_lms(rgb: np.ndarray) -> np.ndarray:
    """Convert an array of RGB values (0..1) to LMS using matrix multiplication.
       Input shape: (..., 3). Output same shape."""
    shape = rgb.shape
    flat = rgb.reshape(-1, 3).T  # (3, N)
    lms_flat = RGB_TO_LMS.dot(flat)  # (3, N)
    lms = lms_flat.T.reshape(shape)
    return lms

def lms_to_rgb(lms: np.ndarray) -> np.ndarray:
    """Convert LMS back to RGB (0..1)."""
    shape = lms.shape
    flat = lms.reshape(-1, 3).T
    rgb_flat = LMS_TO_RGB.dot(flat)
    rgb = rgb_flat.T.reshape(shape)
    return rgb

def simulate_cvd(rgb: np.ndarray, cvd_type: str) -> np.ndarray:
    """
    Simulate color vision deficiency on an RGB image (float 0..1).
    cvd_type: 'protan', 'deutan', or 'tritan'
    """
    if cvd_type not in CVD_MATRICES:
        raise ValueError("Unknown cvd_type. Choose 'protan', 'deutan', or 'tritan'.")
    # Convert to LMS
    lms = rgb_to_lms(rgb)
    # Apply confusion matrix in LMS space
    mat = CVD_MATRICES[cvd_type]
    shape = lms.shape
    flat = lms.reshape(-1, 3).T  # (3, N)
    lms_cvd_flat = mat.dot(flat)
    lms_cvd = lms_cvd_flat.T.reshape(shape)
    # Back to RGB
    rgb_cvd = lms_to_rgb(lms_cvd)
    # Clip to valid ranges
    rgb_cvd = np.clip(rgb_cvd, 0.0, 1.0)
    return rgb_cvd

def daltonize(rgb: np.ndarray, cvd_type: str, strength: float = 1.0) -> np.ndarray:
    """
    Daltonize color image for a given CVD type.
    - rgb: float array 0..1
    - cvd_type: 'protan', 'deutan', 'tritan'
    - strength: correction strength (0..1, 1 = full correction)
    Returns daltonized rgb (0..1).
    """
    # Simulate how a color-blind person sees the image
    simulated = simulate_cvd(rgb, cvd_type)
    # Error between original and simulated in RGB
    error = rgb - simulated
    # Map the error into a color-correction term.
    # A commonly used transformation maps error into RGB "enhancement" to increase discriminability.
    # We'll use a small transform matrix to translate error into corrective signal.
    # The transform below is simple and commonly used in daltonization examples.
    correction_matrix = np.array([
        [0.0, 0.0, 0.0],
        [0.7, 1.0, 0.0],
        [0.7, 0.0, 1.0]
    ], dtype=np.float64)

    # Flatten shapes so we can matrix-multiply safely
    flat_error = error.reshape(-1, 3).T  # (3, N)
    corrected_flat = correction_matrix.dot(flat_error)  # (3, N)
    correction = corrected_flat.T.reshape(rgb.shape)

    # Apply correction scaled by strength
    daltonized = rgb + strength * correction

    # Clip
    daltonized = np.clip(daltonized, 0.0, 1.0)
    return daltonized

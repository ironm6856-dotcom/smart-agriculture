"""
Generate realistic synthetic plant leaf test images for demo and evaluation:
1. Tomato Healthy Leaf
2. Tomato Early Blight (target board necrotic lesions)
3. Potato Late Blight (water soaked dark blotches)
4. Corn Common Rust (cinnamon pustules)
"""

import os
import numpy as np
from PIL import Image, ImageDraw

LEAF_DIR = os.path.join(os.path.dirname(__file__), 'static', 'images', 'sample_leaves')
os.makedirs(LEAF_DIR, exist_ok=True)

def create_leaf_base(bg_color=(240, 244, 240)):
    # 300x300 image
    img = Image.new('RGB', (300, 300), bg_color)
    draw = ImageDraw.Draw(img)
    # Leaf outline ellipse
    leaf_shape = [(60, 40), (240, 260)]
    draw.ellipse(leaf_shape, fill=(46, 125, 50), outline=(27, 94, 32), width=3)
    # Central vein
    draw.line([(150, 40), (150, 260)], fill=(76, 175, 80), width=4)
    # Side veins
    for y in range(80, 240, 35):
        draw.line([(150, y), (90, y - 15)], fill=(76, 175, 80), width=2)
        draw.line([(150, y), (210, y - 15)], fill=(76, 175, 80), width=2)
    return img, draw

def generate_healthy_leaf():
    img, draw = create_leaf_base()
    # Lush vibrant green gradient
    img.save(os.path.join(LEAF_DIR, 'tomato_healthy.jpg'), 'JPEG', quality=95)
    print("Generated: tomato_healthy.jpg")

def generate_early_blight_leaf():
    img, draw = create_leaf_base()
    # Draw concentric dark brown target-board lesions with yellow chlorotic halos
    lesions = [(110, 110, 35), (190, 140, 30), (140, 200, 25), (100, 170, 20)]
    for (x, y, r) in lesions:
        # Yellow halo
        draw.ellipse([(x - r - 8, y - r - 8), (x + r + 8, y + r + 8)], fill=(190, 180, 50))
        # Concentric brown rings
        draw.ellipse([(x - r, y - r), (x + r, y + r)], fill=(101, 67, 33))
        draw.ellipse([(x - r + 6, y - r + 6), (x + r - 6, y + r - 6)], fill=(70, 40, 15))
        draw.ellipse([(x - r + 12, y - r + 12), (x + r - 12, y + r - 12)], fill=(40, 20, 5))
    img.save(os.path.join(LEAF_DIR, 'tomato_early_blight.jpg'), 'JPEG', quality=95)
    print("Generated: tomato_early_blight.jpg")

def generate_late_blight_leaf():
    img, draw = create_leaf_base()
    # Large irregular water-soaked dark purplish-black necrotic patches
    blotches = [(80, 80, 50), (160, 160, 65), (120, 220, 40)]
    for (x, y, r) in blotches:
        draw.ellipse([(x - r, y - r), (x + r, y + r)], fill=(50, 40, 45))
        draw.ellipse([(x - r + 10, y - r + 10), (x + r - 10, y + r - 10)], fill=(30, 25, 30))
    img.save(os.path.join(LEAF_DIR, 'potato_late_blight.jpg'), 'JPEG', quality=95)
    print("Generated: potato_late_blight.jpg")

def generate_corn_rust_leaf():
    img = Image.new('RGB', (300, 300), (240, 244, 240))
    draw = ImageDraw.Draw(img)
    # Long corn blade
    draw.polygon([(110, 20), (190, 20), (180, 280), (120, 280)], fill=(76, 175, 80), outline=(46, 125, 50), width=2)
    # Veins
    for x in range(125, 175, 10):
        draw.line([(x, 20), (x, 280)], fill=(102, 187, 106), width=1)
    # Numerous cinnamon-brown/orange powdery rust pustules
    np.random.seed(101)
    for _ in range(80):
        rx = int(np.random.uniform(125, 175))
        ry = int(np.random.uniform(30, 270))
        draw.ellipse([(rx - 3, ry - 5), (rx + 3, ry + 5)], fill=(184, 75, 20), outline=(130, 50, 10))
    img.save(os.path.join(LEAF_DIR, 'corn_common_rust.jpg'), 'JPEG', quality=95)
    print("Generated: corn_common_rust.jpg")

if __name__ == '__main__':
    generate_healthy_leaf()
    generate_early_blight_leaf()
    generate_late_blight_leaf()
    generate_corn_rust_leaf()

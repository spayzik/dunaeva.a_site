"""Create a seamless static ivory paper tile; Python standard library only."""
from pathlib import Path
import math
import random
import struct
import zlib

SIZE = 512
BASE = (247, 245, 239)
random.seed(260930)

def field(width, height):
    return [[random.gauss(0, 1) for _ in range(width)] for _ in range(height)]

def sample(grid, x, y):
    height, width = len(grid), len(grid[0])
    u, v = x * width / SIZE, y * height / SIZE
    ix, iy = math.floor(u), math.floor(v)
    fx, fy = u - ix, v - iy
    fx, fy = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)
    return ((grid[iy % height][ix % width] * (1 - fx) + grid[iy % height][(ix + 1) % width] * fx) * (1 - fy)
            + (grid[(iy + 1) % height][ix % width] * (1 - fx) + grid[(iy + 1) % height][(ix + 1) % width] * fx) * fy)

cloud = field(32, 32)
fiber = field(128, 256)
rows = bytearray()
for y in range(SIZE):
    rows.append(0)  # PNG row filter
    for x in range(SIZE):
        delta = round(random.gauss(0, 1.05) + sample(cloud, x, y) * .65 + sample(fiber, x, y) * .5)
        rows.append(max(-5, min(5, delta)) + 5)

def chunk(kind, data):
    return struct.pack('!I', len(data)) + kind + data + struct.pack('!I', zlib.crc32(kind + data) & 0xffffffff)

palette = bytes(channel + delta for delta in range(-5, 6) for channel in BASE)
png = (b'\x89PNG\r\n\x1a\n'
       + chunk(b'IHDR', struct.pack('!IIBBBBB', SIZE, SIZE, 8, 3, 0, 0, 0))
       + chunk(b'PLTE', palette)
       + chunk(b'IDAT', zlib.compress(rows, 9)) + chunk(b'IEND', b''))
output = Path(__file__).resolve().parents[1] / 'public/assets/paper-ivory.png'
output.write_bytes(png)
print(f'{output.name}: {len(png):,} bytes')

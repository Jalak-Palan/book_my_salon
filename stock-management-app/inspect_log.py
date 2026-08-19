import pathlib
p = pathlib.Path('eas_install_log.txt')
data = p.read_bytes()
print(data[:8])
print(len(data))
print('gzip', data[:2] == b'\x1f\x8b')
print('zstd', data[:4] == b'\x28\xb5\x2f\xfd')
print('brotli', data[:3] == b'\xce\xb2\xcf')

import urllib.request
url = "https://storage.googleapis.com/eas-workflows-production/logs/f5ff10c9-fd0b-407c-8ef6-e05fe5f03bd8/da0e4814-763c-4342-9851-ade0b443e5fc/2026-07-17T05%3A11%3A39Z-71a4ac50-c1af-4f41-81ba-4622b2ea8442.txt?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=www-production%40exponentjs.iam.gserviceaccount.com%2F20260717%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260717T051732Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=252246c14afdca1879080c156fcafb8a442eb3d201424992d08e96db64d641bbd8461b3040d899d92c2c5e8a2db9cfa1a88952ad0b338dace7e463f1830ae5df39fa6de16aaaa075a3204e3762cb326905b86b50ccba7d2dca051be9791a26d488b9bc75b4dec6c37167ae5dfeed5d101aa1536c25d151239ffd26e124649d5183eb95bd248c657eeb66bba2df03a8512a319637c821f0951119f5f367663de0d97f4a5fef3adfef0665b7d279770078c37e162feecb585e7039f1a122438068ea1c4e74ded79c62fcf1b46b775d9dad9708b429bd7fd13928b63b83ace6f7e8b23eb6949b7386670d12df3d7bdcff21412b30cc0bdd42b08f1014af7ad52dac"
req = urllib.request.Request(url, headers={'User-Agent':'python-urllib/3'})
with urllib.request.urlopen(req) as res:
    data = res.read()
    print('status', res.status)
    print('content-length', len(data))
    print('content-type', res.getheader('Content-Type'))
    print('content-encoding', res.getheader('Content-Encoding'))
    print(data[:32])
    open('fetch_log.bin','wb').write(data)

#!/usr/bin/env python3
"""Pembuat halaman statis SEO: halaman destinasi (/lembang, /ciwidey, /pangalengan, /kota-bandung) dan blog (/blog/, /blog/<slug>).
Jalankan dari akar repo:  python3 alat/buat_halaman.py
Sumber: alat/destinasi.json dan alat/blog/*.md (baris pertama blok '---' berisi judul/deskripsi/tanggal/gambar/kata_kunci).
Hasil (JANGAN disunting langsung, sunting sumbernya lalu jalankan ulang): lembang.html, ciwidey.html, pangalengan.html, kota-bandung.html, blog/*.html, sitemap.xml.
"""
import json, html, re, pathlib, datetime

AKAR = pathlib.Path(__file__).resolve().parent.parent
SITUS = 'https://tempera.id'
WA = '6285196755972'
e = html.escape

KEPALA = '''<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{judul}</title>
<meta name="description" content="{desk}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="{og_type}">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{og_judul}">
<meta property="og:description" content="{desk}">
<meta property="og:image" content="{gambar_abs}">
<meta property="og:locale" content="id_ID">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{akar}css/main.css?v=20261020b">
<link rel="stylesheet" href="{akar}css/produk.css?v=2">
<link rel="icon" type="image/png" sizes="48x48" href="{akar}images/tempera-48.png">
<link rel="apple-touch-icon" href="{akar}images/tempera-apple-180.png">
<meta name="theme-color" content="#0891b2">
{ld}
<script async src="https://www.googletagmanager.com/gtag/js?id=G-M9NQ9R4HZH"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-M9NQ9R4HZH');</script>
<script>!function(f,b,e,v,n,t,s){{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)}};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1831256764539710');fbq('track','PageView');</script>
</head>
<body data-halaman="{halaman}">
<header class="ptop"><div class="pw">
  <a class="pbrand" href="/"><span class="logo" style="--w:32px" role="img" aria-label="Logo Tempera"></span><span><b>TEMPERA</b><small>Teman Perjalanan</small></span></a>
  <nav class="pnav">
    <a class="pl hp-sembunyi" href="/">Beranda</a>
    <a class="pl hp-sembunyi" href="/open-trip">Open Trip</a>
    <a class="pl hp-sembunyi" href="/blog/">Blog</a>
    <a class="pbtn" href="/#destinasi" style="padding:9px 16px;font-size:12px">Pesan</a>
  </nav>
</div></header>
'''

KAKI = '''
<footer class="pfoot"><div class="pw">
  <p><a href="/">Tempera</a><a href="/lembang">Lembang</a><a href="/ciwidey">Ciwidey</a><a href="/pangalengan">Pangalengan</a><a href="/kota-bandung">Kota Bandung</a></p>
  <p><a href="/bandara">Antar Jemput Bandara</a><a href="/open-trip">Open Trip</a><a href="/blog/">Blog</a><a href="/syarat.html">Syarat &amp; Ketentuan</a></p>
  <p>© 2026 Tempera · NIB 1710260026226</p>
</div></footer>
<a class="pwa" href="https://wa.me/{wa}?text={wa_teks}" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.46 2 2.05 6.41 2.05 12c0 1.76.46 3.48 1.32 4.99L2 22l5.18-1.36A9.82 9.82 0 0 0 12.04 22c5.58 0 10-4.41 10-9.99 0-2.67-1.04-5.18-2.99-7.1zm-7.01 15.24a8.07 8.07 0 0 1-4.11-1.13l-.3-.18-3.07.81.82-2.99-.19-.31A8.08 8.08 0 0 1 4.03 12c0-4.49 3.65-8.14 8.15-8.14a8.1 8.1 0 0 1 8.15 8.15c0 4.5-3.66 8.14-8.29 8.14z"/></svg><span>WhatsApp</span></a>
<script>
/* klik WA & tombol pesan dicatat ke GA4/Pixel (tanpa data pribadi) */
document.addEventListener('click',function(ev){{var a=ev.target.closest&&ev.target.closest('a');if(!a)return;var h=document.body.dataset.halaman;
 try{{if(a.href.indexOf('wa.me')>-1){{window.gtag&&gtag('event','klik_wa',{{lokasi:h}});window.fbq&&fbq('track','Contact');}}
 else if(a.dataset.cta){{window.gtag&&gtag('event','klik_pesan',{{lokasi:h}});}}}}catch(e){{}}}},true);
</script>
</body>
</html>
'''


def ld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False) + '</script>'


def halaman_destinasi(d, semua):
    url = f"{SITUS}/{d['slug']}"
    gambar = 'images/' + d['gambar']
    faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in d['faq']]}
    remah = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Tempera", "item": SITUS + "/"},
        {"@type": "ListItem", "position": 2, "name": d['nama'], "item": url}]}
    tempat = {"@context": "https://schema.org", "@type": "TouristDestination", "name": d['nama'], "description": d['desk'],
              "touristType": "Wisata keluarga", "includesAttraction": [{"@type": "TouristAttraction", "name": n} for n, _ in d['tempat']]}
    out = [KEPALA.format(judul=e(d['judul']), desk=e(d['desk']), url=url, og_type='website', og_judul=e(d['judul']),
                         gambar_abs=f"{SITUS}/{gambar}", akar='/', ld='\n'.join(ld(x) for x in (tempat, faq_ld, remah)), halaman='dest_' + d['slug'])]
    out.append(f'''<section class="phero foto" style="background-image:url(/{gambar})"><div class="pw">
  <span class="pkicker">{e(d['kicker'])}</span>
  <h1>{e(d['h1'])}</h1>
  <p class="sub">{e(d['sub'])}</p>
  <ul class="pchips">{''.join(f'<li>{e(c)}</li>' for c in d['chips'])}</ul>
  <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap">
    <a class="pbtn putih" href="/#destinasi" data-cta="1">Pesan trip {e(d['nama_pendek'])}</a>
    <a class="pbtn wa" href="https://wa.me/{WA}?text={e(_url(d['wa']))}" target="_blank" rel="noopener">Tanya lewat WhatsApp</a>
  </div>
</div></section>
<section class="psec"><div class="pw" style="max-width:820px">
  <h2>{e(d['intro_judul'])}</h2>
  {''.join(f'<p style="font-size:15px;color:var(--text-secondary)">{p}</p>' for p in d['intro'])}
  <div class="pgrid" style="margin-top:18px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">
    {''.join(f'<div class="pcard"><h3 style="font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted)">{e(k)}</h3><p style="margin:4px 0 0;font-weight:700">{e(v)}</p></div>' for k, v in d['fakta'])}
  </div>
</div></section>
<section class="psec alt"><div class="pw">
  <h2>Tempat wisata di {e(d['nama_pendek'])}</h2>
  <p class="lead">Pilih tempat yang ingin dikunjungi saat memesan. Dalam sewa 12 jam biasanya cukup untuk 3 sampai 5 tempat, tergantung lama di tiap lokasi.</p>
  <div class="pgrid">{''.join(f'<div class="pcard"><h3>{e(n)}</h3><p class="muat" style="font-size:13.5px">{e(k)}</p></div>' for n, k in d['tempat'])}</div>
</div></section>
<section class="psec"><div class="pw" style="max-width:820px">
  <h2>Contoh rute 12 jam</h2>
  <p class="lead">{e(d['rute_lead'])}</p>
  <ol class="plist" style="font-size:15px">{''.join(f'<li><b>{e(j)}</b> · {e(t)}</li>' for j, t in d['rute'])}</ol>
  <div class="pcard" style="margin-top:20px">
    <h3>Harga sewa mobil + driver</h3>
    <p class="harga" style="font-family:'Cormorant Garamond',serif;font-size:30px;color:var(--accent);margin:8px 0 4px">mulai Rp550.000 <small style="font-family:Inter,sans-serif;font-size:12px;color:var(--text-muted)">/ 12 jam</small></p>
    <p class="muat" style="font-size:13.5px">Sudah termasuk mobil, driver, BBM, dan air mineral. Tol, parkir, tiket masuk, dan makan driver tidak termasuk. {e(d['catatan_harga'])}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px"><a class="pbtn" href="/#destinasi" data-cta="1">Pilih destinasi &amp; pesan</a><a class="pbtn ghost" href="/#daftar-harga">Lihat semua harga</a></div>
  </div>
  <p style="font-size:14px;color:var(--text-secondary);margin-top:16px">Datang sendiri atau berdua? Cek jadwal <a href="/open-trip" style="text-decoration:underline">open trip</a> dengan harga per kursi.</p>
</div></section>
<section class="psec alt pfaq"><div class="pw" style="max-width:820px">
  <h2>Pertanyaan seputar {e(d['nama_pendek'])}</h2>
  {''.join(f'<details><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in d['faq'])}
</div></section>
<section class="psec"><div class="pw">
  <h2>Destinasi lain</h2>
  <div class="pgrid">{''.join(f'<a class="pcard" href="/{o["slug"]}" style="text-decoration:none"><h3>{e(o["nama"])}</h3><p class="muat">{e(o["kicker"])}</p></a>' for o in semua if o['slug'] != d['slug'])}</div>
</div></section>''')
    out.append(KAKI.format(wa=WA, wa_teks=e(_url(d['wa']))))
    return ''.join(out)


def _url(s):
    from urllib.parse import quote
    return quote(s)


def baca_md(p):
    t = p.read_text(encoding='utf-8')
    m = re.match(r'---\n(.*?)\n---\n(.*)', t, re.S)
    meta = dict(re.findall(r'^(\w+):\s*(.*)$', m.group(1), re.M))
    meta['slug'] = p.stem
    meta['isi'] = m.group(2).strip()
    return meta


def md_html(teks):
    """Markdown sederhana: ## judul, ### subjudul, - daftar, 1. daftar bernomor, **tebal**, [teks](url), paragraf."""
    def inline(s):
        s = e(s)
        s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
        s = re.sub(r'\[(.+?)\]\((/[^)\s]*|https://[^)\s]+)\)', r'<a href="\2" style="text-decoration:underline">\1</a>', s)
        return s
    out, daftar = [], None
    for blok in re.split(r'\n\s*\n', teks):
        baris = blok.strip().split('\n')
        if baris[0].startswith('## '):
            out.append(f'<h2 style="margin-top:28px">{inline(baris[0][3:])}</h2>'); baris = baris[1:]
        elif baris[0].startswith('### '):
            out.append(f'<h3 style="margin:22px 0 6px;font-size:18px">{inline(baris[0][4:])}</h3>'); baris = baris[1:]
        if not baris:
            continue
        if all(re.match(r'^(- |\d+\. )', b) for b in baris):
            tag = 'ol' if baris[0][0].isdigit() else 'ul'
            out.append(f'<{tag} class="plist" style="font-size:15.5px">' + ''.join(f'<li>{inline(re.sub(r"^(- |\d+\. )", "", b))}</li>' for b in baris) + f'</{tag}>')
        else:
            out.append(f'<p>{inline(" ".join(baris))}</p>')
    return '\n'.join(out)


def halaman_blog(a, semua):
    url = f"{SITUS}/blog/{a['slug']}"
    gambar = 'images/' + a.get('gambar', 'hero.webp')
    art = {"@context": "https://schema.org", "@type": "BlogPosting", "headline": a['judul'], "description": a['deskripsi'],
           "datePublished": a['tanggal'], "dateModified": a.get('diperbarui', a['tanggal']), "image": f"{SITUS}/{gambar}",
           "author": {"@type": "Organization", "name": "Tempera"}, "publisher": {"@type": "Organization", "name": "Tempera", "logo": {"@type": "ImageObject", "url": f"{SITUS}/images/tempera-apple-180.png"}},
           "mainEntityOfPage": url, "inLanguage": "id-ID"}
    tgl = datetime.date.fromisoformat(a['tanggal'])
    bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][tgl.month - 1]
    lain = [x for x in semua if x['slug'] != a['slug']][:3]
    out = [KEPALA.format(judul=e(a['judul'] + ' | Blog Tempera'), desk=e(a['deskripsi']), url=url, og_type='article', og_judul=e(a['judul']),
                         gambar_abs=f"{SITUS}/{gambar}", akar='/', ld=ld(art), halaman='blog_' + a['slug'])]
    out.append(f'''<section class="phero foto" style="background-image:url(/{gambar});padding:44px 0 50px"><div class="pw" style="max-width:820px">
  <span class="pkicker"><a href="/blog/" style="text-decoration:none">Blog Tempera</a></span>
  <h1 style="font-size:clamp(30px,5.5vw,48px)">{e(a['judul'])}</h1>
  <p class="sub">{tgl.day} {bulan} {tgl.year}</p>
</div></section>
<article class="psec"><div class="pw artikel" style="max-width:760px;font-size:16px;line-height:1.75;color:var(--text-secondary)">
{md_html(a['isi'])}
<div class="pcard" style="margin-top:32px"><h3>Butuh mobil + driver di Bandung?</h3><p class="muat" style="font-size:14px">Sewa 12 jam mulai Rp550.000, sudah termasuk BBM dan driver lokal. Pesan dan bayar online.</p>
<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px"><a class="pbtn" href="/#destinasi" data-cta="1">Pesan sekarang</a><a class="pbtn ghost" href="/open-trip">Lihat open trip</a></div></div>
</div></article>
{'<section class="psec alt"><div class="pw"><h2>Baca juga</h2><div class="pgrid">' + ''.join(f'<a class="pcard" href="/blog/{x["slug"]}" style="text-decoration:none"><h3>{e(x["judul"])}</h3><p class="muat">{e(x["deskripsi"])}</p></a>' for x in lain) + '</div></div></section>' if lain else ''}''')
    out.append(KAKI.format(wa=WA, wa_teks=e(_url('Halo Tempera, saya baca blog dan mau tanya sewa mobil.'))))
    return ''.join(out)


def indeks_blog(semua):
    url = f"{SITUS}/blog/"
    out = [KEPALA.format(judul='Blog Tempera: Panduan Wisata Bandung', desk='Tips dan panduan wisata Bandung: rute Lembang, Ciwidey, Pangalengan, waktu terbaik berkunjung, dan cara hemat sewa mobil + driver.',
                         url=url, og_type='website', og_judul='Blog Tempera', gambar_abs=f"{SITUS}/images/og-tempera.jpg", akar='/',
                         ld=ld({"@context": "https://schema.org", "@type": "Blog", "name": "Blog Tempera", "url": url}), halaman='blog')]
    kartu = ''.join(f'''<a class="otkartu" href="/blog/{a['slug']}" style="text-decoration:none;color:inherit">
      <div class="foto" style="background-image:url('/images/{e(a.get('gambar', 'hero.webp'))}')"></div>
      <div class="isi"><h3>{e(a['judul'])}</h3><p class="meta">{e(a['deskripsi'])}</p><p class="meta" style="margin-top:auto">{e(a['tanggal'])}</p></div></a>''' for a in semua)
    out.append(f'''<section class="phero" style="padding:44px 0 50px"><div class="pw"><span class="pkicker">Blog</span><h1>Panduan wisata Bandung</h1>
<p class="sub">Rute, tips, dan cerita perjalanan dari driver lokal Tempera.</p></div></section>
<section class="psec"><div class="pw"><div class="pgrid">{kartu or '<div class="kosong">Artikel pertama segera terbit.</div>'}</div></div></section>''')
    out.append(KAKI.format(wa=WA, wa_teks=e(_url('Halo Tempera, saya mau tanya sewa mobil.'))))
    return ''.join(out)


def sitemap(dest, blog):
    hari = datetime.date.today().isoformat()
    tetap = [('/', '1.0'), ('/bandara', '0.9'), ('/open-trip', '0.9'), ('/galeri.html', '0.5'), ('/syarat.html', '0.3'), ('/blog/', '0.6')]
    u = [(p, pr, hari) for p, pr in tetap] + [('/' + d['slug'], '0.8', hari) for d in dest] + [('/blog/' + a['slug'], '0.6', a.get('diperbarui', a['tanggal'])) for a in blog]
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
        f'  <url><loc>{SITUS}{p}</loc><lastmod>{t}</lastmod><priority>{pr}</priority></url>\n' for p, pr, t in u) + '</urlset>\n'


def main():
    dest = json.loads((AKAR / 'alat/destinasi.json').read_text(encoding='utf-8'))
    for d in dest:
        (AKAR / f"{d['slug']}.html").write_text(halaman_destinasi(d, dest), encoding='utf-8')
    blog = sorted([baca_md(p) for p in (AKAR / 'alat/blog').glob('*.md') if not p.name.startswith('_')], key=lambda a: a['tanggal'], reverse=True)
    (AKAR / 'blog').mkdir(exist_ok=True)
    for a in blog:
        (AKAR / f"blog/{a['slug']}.html").write_text(halaman_blog(a, blog), encoding='utf-8')
    (AKAR / 'blog/index.html').write_text(indeks_blog(blog), encoding='utf-8')
    (AKAR / 'sitemap.xml').write_text(sitemap(dest, blog), encoding='utf-8')
    print(f'{len(dest)} halaman destinasi, {len(blog)} artikel blog, sitemap diperbarui')


if __name__ == '__main__':
    main()

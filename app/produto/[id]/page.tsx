'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function ProdutoComum() {
  const params = useParams();
  const id = String(params?.id || '');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [video, setVideo] = useState('');

  useEffect(() => {
    async function load() {
      if (!supabase || !id) return;
      const productsResult = await supabase.rpc('storefront_products');
      const found = (productsResult.data || []).find((item: any) => String(item.id) === id);
      setProduct(found || null);
      const mediaResult = await supabase.rpc('storefront_product_media', { p_id: id });
      setVideo(mediaResult.data?.[0]?.video_url || '');
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return <main><section style={{ maxWidth: 1100, margin: '60px auto', padding: 24 }}>Carregando produto...</section></main>;
  }

  if (!product) {
    return <main><section style={{ maxWidth: 1100, margin: '60px auto', padding: 24 }}><h1>Produto não encontrado</h1><Link href="/">Voltar para a loja</Link></section></main>;
  }

  const images = product.imagens || [];
  const showingVideo = selectedImage === -1 && Boolean(video);
  const stockColor = product.estoque > 0 ? '#356a46' : '#b42318';
  const buyColor = product.estoque > 0 ? '#ff176b' : '#aab7c0';
  const pointer = product.estoque > 0 ? 'auto' : 'none';

  return (
    <main>
      <header>
        <Link href="/" className="logo"><b>Cane</b><strong>Kids</strong></Link>
        <nav><Link href="/">Início</Link><Link href="/carrinho">Sacola</Link></nav>
      </header>
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '46px 24px', display: 'grid', gridTemplateColumns: 'minmax(0,1.05fr) minmax(360px,.75fr)', gap: 44, alignItems: 'start' }}>
        <div>
          {showingVideo ? (
            <video src={video} controls playsInline style={{ width: '100%', height: 560, objectFit: 'contain', background: '#111', borderRadius: 22 }} />
          ) : images[selectedImage] ? (
            <img src={images[selectedImage]} alt={product.nome} style={{ width: '100%', height: 560, objectFit: 'contain', background: '#f7f8fa', borderRadius: 22 }} />
          ) : (
            <div style={{ height: 500, background: '#f7f8fa', borderRadius: 22, display: 'grid', placeItems: 'center' }}>Sem imagem</div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 12, overflowX: 'auto', paddingBottom: 6 }}>
            {video ? <button type="button" onClick={() => setSelectedImage(-1)} style={{ minWidth: 92, height: 82, border: '1px solid #dbe5ec', borderRadius: 10, background: '#123b59', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Vídeo</button> : null}
            {images.map((url: string, index: number) => (
              <button type="button" key={url} onClick={() => setSelectedImage(index)} style={{ minWidth: 92, height: 82, padding: 3, border: '1px solid #dbe5ec', borderRadius: 10, background: '#fff', cursor: 'pointer' }}>
                <img src={url} alt={'Imagem ' + (index + 1)} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 7 }} />
              </button>
            ))}
          </div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #dbe5ec', borderRadius: 18, padding: 28 }}>
          <div style={{fontSize:12,color:'#718695',marginBottom:12}}><Link href="/">Início</Link> &nbsp;›&nbsp; {product.categoria}</div><span style={{ fontSize: 12, fontWeight: 800, color: '#087bc1' }}>{product.categoria}</span>
          <h1 style={{ fontSize: 36, lineHeight: 1.1, margin: '10px 0 14px' }}>{product.nome}</h1>
          <div style={{color:'#f3a400',fontWeight:800,margin:'10px 0'}}>★★★★★ <span style={{color:'#718695',fontSize:12,fontWeight:600}}>Produto novo</span></div><p style={{ color: '#60788a', fontSize: 16, lineHeight: 1.6 }}>{product.descricao || 'Produto CaneKids.'}</p>
          <div style={{ fontSize: 30, fontWeight: 900, margin: '24px 0' }}>R$ {Number(product.preco).toFixed(2).replace('.', ',')}</div>
          <div style={{ fontSize: 13, color: stockColor, marginBottom: 18 }}>{product.estoque > 0 ? 'Em estoque · ' + product.estoque + ' unidade(s)' : 'Produto indisponível'}</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:18,fontSize:12}}><div style={{padding:12,background:'#f7fafc',borderRadius:10}}><b>Envio para todo o Brasil</b><br/>Frete calculado no checkout</div><div style={{padding:12,background:'#f7fafc',borderRadius:10}}><b>Compra segura</b><br/>Pagamento protegido</div></div>
          <Link href={'/carrinho?produto=' + encodeURIComponent(product.id) + '&nome=' + encodeURIComponent(product.nome) + '&preco=' + encodeURIComponent(product.preco)} style={{ display: 'block', textAlign: 'center', background: buyColor, color: '#fff', padding: '16px', borderRadius: 10, fontWeight: 800, textDecoration: 'none', pointerEvents: pointer }}>Adicionar à sacola • R$ {Number(product.preco).toFixed(2).replace('.', ',')}</Link>
          <div style={{ fontSize: 12, color: '#60788a', textAlign: 'center', marginTop: 12 }}>Compra segura · Produto conferido antes do envio</div><div style={{marginTop:26,paddingTop:22,borderTop:'1px solid #e5edf1'}}><h3 style={{margin:'0 0 10px'}}>Detalhes do produto</h3><p style={{color:'#60788a',fontSize:14,lineHeight:1.6}}>Produto personalizado CaneKids, produzido sob demanda e preparado para presentear. As imagens da galeria mostram opções e detalhes do modelo.</p><details style={{padding:'12px 0',borderTop:'1px solid #edf2f5'}}><summary style={{fontWeight:700,cursor:'pointer'}}>Como funciona a entrega?</summary><p style={{fontSize:13,color:'#60788a'}}>Informe seu CEP no checkout para consultar as opções disponíveis.</p></details><details style={{padding:'12px 0',borderTop:'1px solid #edf2f5'}}><summary style={{fontWeight:700,cursor:'pointer'}}>Posso tirar dúvidas antes de comprar?</summary><p style={{fontSize:13,color:'#60788a'}}>Sim. Nosso atendimento pode orientar sobre o produto e a personalização.</p></details></div>
        </div>
      </section>
    </main>
  );
}

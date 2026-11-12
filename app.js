(function(){
  var D = window.IC_DATA;
  var BRL = function(v){ return 'R$ ' + Math.round(v).toLocaleString('pt-BR'); };

  // layout final escolhido por Junio: Netflix escuro
  document.body.dataset.layout = 'netflix';

  // generic WA links
  document.getElementById('wa-float').href = D.wa_generic;
  document.getElementById('wa-footer').href = D.wa_generic;
  document.getElementById('wa-top').href = D.wa_generic;

  var CAT_ORDER = ['lancamentos','apartamentos','casas','terrenos','chacaras'];

  function propCard(p){
    var el = document.createElement('article'); el.className='card';
    var meta = [];
    if(p.q) meta.push(p.q + (p.q===1?' quarto':' quartos'));
    if(p.area) meta.push(Math.round(p.area) + ' m²');
    el.innerHTML =
      '<div class="card-img"><img loading="lazy" src="'+p.img+'" alt="'+p.name.replace(/"/g,'')+'" onerror="this.parentNode.style.display=\'none\'">' +
      (p.ebm ? '<span class="badge">Lançamento EBM</span>' : '') + '</div>' +
      '<div class="card-body">' +
        '<h3 class="card-name">'+p.name+'</h3>' +
        '<p class="card-loc">'+[p.bairro,p.cidade].filter(Boolean).join(' · ')+'</p>' +
        '<p class="card-price">'+BRL(p.price)+'<small>tabela vigente no portal</small></p>' +
        (meta.length? '<p class="card-meta">'+meta.join(' · ')+'</p>' : '') +
        '<a class="card-wa" href="'+p.wa+'" target="_blank" rel="noopener">Consultar no WhatsApp</a>' +
      '</div>';
    return el;
  }

  function blockCard(c){
    var el = document.createElement('article'); el.className='card';
    el.innerHTML =
      '<div class="card-img"><img loading="lazy" src="'+c.img+'" alt="'+c.name+'"></div>' +
      '<div class="card-body">' +
        '<h3 class="card-name">'+c.name+'</h3>' +
        '<p class="card-meta">'+c.desc+'</p>' +
        '<a class="card-open" href="'+c.url+'" target="_blank" rel="noopener">Abrir ↗</a>' +
      '</div>';
    return el;
  }

  function render(){
    var app = document.getElementById('app');
    app.innerHTML = '';

    // hero
    var destaques = D.props.filter(function(p){return p.destaque;});
    var hero = document.createElement('section'); hero.className='hero';
    hero.innerHTML =
      '<img class="hero-bg" src="https://investecanedo.com.br/og-image.jpg" alt="">' +
      '<div class="hero-inner">' +
        '<p class="hero-kicker">Senador Canedo · Goiás</p>' +
        '<h1>Imóveis para investir e morar,<br>num só lugar.</h1>' +
        '<p>Lançamentos EBM, apartamentos Tenda em Goiânia, casas, terrenos e o loteamento Reserva do Parque, com mapa interativo e maquete 3D. Toque em qualquer imóvel e fale direto no WhatsApp.</p>' +
        '<a class="hero-cta" href="'+D.wa_generic+'" target="_blank" rel="noopener">Falar com a Investe Canedo</a>' +
        '<div class="hero-stats">' +
          '<span><b>'+D.props.length+'</b>imóveis na vitrine</span>' +
          '<span><b>'+D.props.filter(function(p){return p.ebm;}).length+'</b>lançamentos EBM</span>' +
          '<span><b>3</b>mapas e maquetes 3D</span>' +
        '</div>' +
      '</div>';
    app.appendChild(hero);

    var rows = {};
    CAT_ORDER.forEach(function(c){
      rows[c] = D.props.filter(function(p){return p.cat===c;});
    });

    function addRow(cat, key){
      var list = rows[key]; if(!list.length) return;
      var sec = document.createElement('section'); sec.className='row'; sec.dataset.cat=key;
      sec.innerHTML = '<div class="row-head"><div><p class="row-tag">'+cat+'</p>'+
        '<h2 class="row-title">'+D.cats[key]+'</h2></div><span class="row-count">'+list.length+' imóveis</span></div>';
      var rail = document.createElement('div'); rail.className='rail';
      list.forEach(function(p){ rail.appendChild(propCard(p)); });
      sec.appendChild(rail); app.appendChild(sec);
    }

    function addBlock(s){
      var sec = document.createElement('section'); sec.className='block'; sec.dataset.cat='mapas';
      sec.innerHTML = '<p class="block-tag">'+s.tag+'</p><h2 class="block-title">'+s.title+'</h2>'+
        '<p class="block-desc">'+s.desc+'</p>';
      var rail = document.createElement('div'); rail.className='rail';
      s.cards.forEach(function(c){ rail.appendChild(blockCard(c)); });
      sec.appendChild(rail); app.appendChild(sec);
    }

    addRow('Lançamentos','lancamentos');
    addBlock(D.sections[0]); // Reserva do Parque
    addRow('Portal','apartamentos');
    addBlock(D.sections[1]); // Tenda
    addRow('Portal','casas');
    addBlock(D.sections[2]); // TCM
    addRow('Portal','terrenos');
    addRow('Portal','chacaras');
    addBlock(D.sections[3]); // Investe em Lotes
    addPriceList();
  }

  // Lista de preços para conferência (tabela vigente, em revisão por Junio)
  function addPriceList(){
    var sec = document.createElement('section'); sec.className='block pricelist';
    sec.innerHTML = '<p class="block-tag">Conferência</p><h2 class="block-title">Lista de preços</h2>'+
      '<p class="block-desc">Valores da tabela vigente publicada no portal, em conferência. Qualquer correção, fale no WhatsApp.</p>';
    CAT_ORDER.forEach(function(c){
      var list = D.props.filter(function(p){return p.cat===c;}).sort(function(a,b){return b.price-a.price;});
      if(!list.length) return;
      var det = document.createElement('details'); det.className='pl-cat';
      var sum = document.createElement('summary');
      sum.innerHTML = D.cats[c] + ' <span>'+list.length+'</span>';
      det.appendChild(sum);
      var ul = document.createElement('ul');
      list.forEach(function(p){
        var li = document.createElement('li');
        li.innerHTML = '<span class="pl-name">'+p.name+'</span><span class="pl-price">'+BRL(p.price)+'</span>';
        ul.appendChild(li);
      });
      det.appendChild(ul); sec.appendChild(det);
    });
    app.appendChild(sec);
  }
  render();
})();

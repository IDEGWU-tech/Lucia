/* Data and state */
const DATA = [
  {id:1,name:'Signature Nail Close-Up',type:'service',price:15000,height:'medium',mediaType:'image',src:'images/lucia-01.jpeg',desc:'Glow-ready nail detail shot with soft shine and a polished finish.',color:'#ffd6e8'},
  {id:2,name:'Custom Pink Nail Art',type:'service',price:12000,height:'tall',mediaType:'image',src:'images/lucia-02.jpeg',desc:'Hand-painted pink nails with floral accents and zebra edge art for a luxe look.',color:'#f8d6e5'},
  {id:3,name:'Nail Glam Detail',type:'service',price:14000,height:'short',mediaType:'image',src:'images/lucia-03.jpeg',desc:'Eye-catching nail styling captured in rich light, highlighting color and curve.',color:'#dce9ff'},
  {id:4,name:'Fresh Face & Nail Mood',type:'service',price:16000,height:'tall',mediaType:'image',src:'images/lucia-04.jpeg',desc:'Clean facial glow paired with stunning nail styling for a fresh beauty statement.',color:'#e8f7df'},
  {id:5,name:'Motion Nail Reveal',type:'product',price:9500,height:'medium',mediaType:'video',src:'images/lucia-05.mp4',desc:'A moving view of the nail set in motion, showing shine and detail from each angle.',color:'#ffe9d9'},
  {id:6,name:'Flutter Nail Clip',type:'product',price:13000,height:'short',mediaType:'video',src:'images/lucia-06.mp4',desc:'Short video clip highlighting vibrant nail movement and polish shine.',color:'#f5e9ff'},
  {id:7,name:'Close-Up Nail Story',type:'product',price:14500,height:'tall',mediaType:'video',src:'images/lucia-07.mp4',desc:'Detailed moving close-up of nail length and art design for a premium finish.',color:'#e9f8f5'},
  {id:8,name:'Nail + Lash Reel',type:'product',price:15500,height:'tall',mediaType:'video',src:'images/lucia-08.mp4',desc:'A polished reel combining nail art and lash styling to show the full beauty look.',color:'#fff0f0'}
];

let cart = [];
const BOARD_KEY = 'moodboard.saved';

/* Helpers */
const q = sel => document.querySelector(sel);
const qs = sel => document.querySelectorAll(sel);
const formatN = n => '₦' + n.toLocaleString();

const renderMedia = item => {
  if(item.mediaType === 'video'){
    return `<video src="${item.src}" muted playsinline loop preload="metadata"></video>`;
  }
  return `<img src="${item.src}" alt="${item.name}" />`;
};

const renderThumb = item => {
  return `<div class="thumb-media">${renderMedia(item)}</div>`;
};

const getItemImageUrl = item => {
  const origin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : '';
  return origin ? `${origin}/${item.src}` : item.src;
};

/* Render functions */
function renderMoodboard(){
  const container = q('#moodboard');
  container.innerHTML = '';
  DATA.forEach(item => {
    const actions = `<button class="btn glow save-board" data-id="${item.id}">Save</button>
      <button class="btn glow book-now" data-id="${item.id}">Book Now</button>`;

    const card = document.createElement('article');
    card.className = `card ${item.height}`;
    card.dataset.type = item.type;
    card.innerHTML = `
      <div class="placeholder">
        ${renderMedia(item)}
        <div class="overlay"></div>
      </div>
      <div class="meta">
        <h4>${item.name}</h4>
        <p class="muted">${item.type} • ${formatN(item.price)}</p>
        <p class="desc">${item.desc}</p>
        <div class="actions">
          ${actions}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

/* Cart UI */
function updateCartCount(){
  const countEl = q('#cart-count');
  if(countEl){
    countEl.textContent = getBoardCount();
  }
}

function renderCart(){
  const list = q('#cart-items');
  list.innerHTML = '';
  let total = 0;
  cart.forEach((id, idx) => {
    const item = DATA.find(d=>d.id===id);
    total += item.price;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="thumb">
        ${renderThumb(item)}
      </div>
      <div style="flex:1">
        <div style="font-weight:600">${item.name}</div>
        <div style="color:#666">${formatN(item.price)}</div>
      </div>
      <button class="btn secondary remove-item" data-idx="${idx}">Remove</button>
    `;
    list.appendChild(el);
  });
  q('#cart-total').textContent = formatN(total);
  updateCartCount();
}

/* Events */
function toggleCart(open){
  const d = q('#cart-drawer');
  d.classList.toggle('open', open);
}

function addToCart(id){
  cart.push(id);
  renderCart();
  toggleCart(true);
}

function removeFromCart(idx){
  cart.splice(idx,1);
  renderCart();
}

/* Board (favorites) */
function getSavedBoard(){
  try{ return JSON.parse(localStorage.getItem(BOARD_KEY))||[] }catch(e){return []}
}
function getBoardCount(){
  return getSavedBoard().length;
}

function updateBoardCount(){
  const countEl = q('#board-count');
  if(countEl){
    countEl.textContent = getBoardCount();
    countEl.style.display = getBoardCount() > 0 ? 'inline-flex' : 'none';
  }
}

function saveToBoard(id){
  const saved = getSavedBoard();
  if(!saved.includes(id)){
    saved.push(id);
    localStorage.setItem(BOARD_KEY, JSON.stringify(saved));
    updateBoardCount();
    updateCartCount();
    if(!q('#board-modal').classList.contains('hidden')){
      renderSavedBoard();
    }
    alert('Saved to your board');
  } else {
    alert('This item is already on your board');
  }
}
function clearBoard(){ localStorage.removeItem(BOARD_KEY); renderSavedBoard(); updateBoardCount(); updateCartCount(); }

function removeSavedItem(id){
  const saved = getSavedBoard().filter(savedId=>savedId !== id);
  localStorage.setItem(BOARD_KEY, JSON.stringify(saved));
  renderSavedBoard();
  updateBoardCount();
  updateCartCount();
}

function renderSavedBoard(){
  const el = q('#saved-board');
  const saved = getSavedBoard();
  el.innerHTML = '';
  if(saved.length===0){ el.innerHTML = '<p>No saved items yet.</p>'; return }
  saved.forEach(id=>{
    const item = DATA.find(d=>d.id===id);
    const card = document.createElement('div');
    card.className='saved-card';
    card.innerHTML = `
      ${renderThumb(item)}
      <div class="saved-card-info">
        <div class="saved-name">${item.name}</div>
        <button class="btn secondary remove-saved" data-id="${item.id}">Remove</button>
      </div>
    `;
    el.appendChild(card);
  });
}

/* Booking & Pay links */
const OWNER = {
  whatsapp: '+2348081043697',
  instagram: 'https://instagram.com/LuciaOmaz',
  tiktok: 'https://tiktok.com/@LuciaOmanjie'
};

function makeWhatsAppLink(number,msg){
  const base = 'https://wa.me/' + number.replace(/[^0-9]/g,'');
  return base + '?text=' + encodeURIComponent(msg);
}

function openPayMenu(itemId){
  const item = DATA.find(d=>d.id===itemId);
  const imageLink = getItemImageUrl(item);
  const text = `Hi Lucia, I would like to book the following service:\n${item.name} - ${formatN(item.price)}\n${item.desc}\nImage: ${imageLink}\nPlease confirm and send me the appointment details.`;
  const wa = makeWhatsAppLink(OWNER.whatsapp, text);
  window.open(wa,'_blank');
}

function openBookingModal(itemId){
  const modal = q('#booking-modal');
  const item = DATA.find(d=>d.id===itemId);
  modal.classList.remove('hidden');
  q('#booking-form [name=itemId]').value = itemId;
  q('#booking-item-name').textContent = item.name;
  q('#booking-item-price').textContent = formatN(item.price);
  q('#booking-item-desc').textContent = item.desc;
  const preview = q('#booking-preview');
  const media = item.mediaType === 'video'
    ? `<video src="${item.src}" muted playsinline loop preload="metadata"></video>`
    : `<img src="${item.src}" alt="${item.name}" />`;
  q('#booking-preview .preview-media').innerHTML = media;
  preview.classList.remove('hidden');
}
function closeBookingModal(){
  q('#booking-modal').classList.add('hidden');
  q('#booking-preview').classList.add('hidden');
}

/* Listeners */
document.addEventListener('click', e=>{
  const add = e.target.closest('.add-cart');
  if(add){ addToCart(Number(add.dataset.id)); return }

  const save = e.target.closest('.save-board');
  if(save){ saveToBoard(Number(save.dataset.id)); return }

  const book = e.target.closest('.book-now');
  if(book){ openBookingModal(Number(book.dataset.id)); return }

  const pay = e.target.closest('button[data-pay]');
  if(pay){ openPayMenu(Number(pay.dataset.pay)); return }

  if(e.target.id==='cart-toggle'){ toggleCart(true); return }
  if(e.target.id==='cart-close'){ toggleCart(false); return }
  if(e.target.id==='checkout-wa'){ // open WA with cart details
    const items = cart.map(id=>DATA.find(d=>d.id===id));
    if(items.length===0){ alert('Cart is empty'); return }
    let msg = 'Hi I would like to order:' + '\n';
    items.forEach(it=> msg += `- ${it.name} (${formatN(it.price)})\n`);
    msg += `Total: ${q('#cart-total').textContent}`;
    window.open(makeWhatsAppLink(OWNER.whatsapp,msg),'_blank');
    return
  }
  const rem = e.target.closest('.remove-item');
  if(rem){ removeFromCart(Number(rem.dataset.idx)); return }

  if(e.target.id==='board-btn'){ q('#board-modal').classList.remove('hidden'); renderSavedBoard(); return }
  if(e.target.id==='board-close'){ q('#board-modal').classList.add('hidden'); return }
  if(e.target.id==='clear-board'){ clearBoard(); return }

  const removeSaved = e.target.closest('.remove-saved');
  if(removeSaved){ removeSavedItem(Number(removeSaved.dataset.id)); return }
  if(e.target.id==='booking-close'){ closeBookingModal(); return }
});

q('#booking-form').addEventListener('submit', e=>{
  e.preventDefault();
  const form = new FormData(e.target);
  const item = DATA.find(d=>d.id===Number(form.get('itemId')));
  const imageLink = getItemImageUrl(item);
  const msg = `Hi Lucia, I would like to book the following service:\n${item.name} - ${formatN(item.price)}\n${item.desc}\nImage: ${imageLink}\n\nCustomer details:\nName: ${form.get('name')}\nPhone: ${form.get('phone')}\nWhen: ${form.get('datetime')}`;
  window.open(makeWhatsAppLink(OWNER.whatsapp,msg),'_blank');
  closeBookingModal();
});

/* Contact link scroll */
q('#contact-link').addEventListener('click', e=>{ e.preventDefault(); q('#contact').scrollIntoView({behavior:'smooth'}); });

/* Toggle hidden info text when nav links clicked */
q('#services-link').addEventListener('click', e=>{ e.preventDefault(); const s = q('#services-text'); s.style.display = s.style.display==='block'?'none':'block'; s.scrollIntoView({behavior:'smooth'}); });
q('#portfolio-link').addEventListener('click', e=>{ e.preventDefault(); const p = q('#portfolio-text'); p.style.display = p.style.display==='block'?'none':'block'; p.scrollIntoView({behavior:'smooth'}); });

/* Init */
document.addEventListener('DOMContentLoaded', ()=>{
  renderMoodboard();
  renderCart();
  updateBoardCount();
});

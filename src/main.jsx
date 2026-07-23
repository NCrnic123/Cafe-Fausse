import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import homeImage from '../images/home-cafe-fausse.webp';
import interiorImage from '../images/gallery-cafe-interior.webp';
import steakImage from '../images/gallery-ribeye-steak.webp';
import specialEvent from '../images/gallery-special-event.webp';
import chef from '../images/chef.jpg';
import bruschetta from '../images/bruschetta.jpg';
import entrance from '../images/entrance.jpg';
import salmon from '../images/grilled-salmon.jpg';
import lasagna from '../images/lasagna.jpg';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const menu = {
  Starters: [['Bruschetta', 'Fresh tomatoes, basil, olive oil, and toasted baguette slices', '$8.50'], ['Caesar Salad', 'Crisp romaine with homemade Caesar dressing', '$9.00']],
  'Main Courses': [['Grilled Salmon', 'Served with lemon butter sauce and seasonal vegetables', '$22.00'], ['Ribeye Steak', '12 oz prime cut with garlic mashed potatoes', '$28.00'], ['Steak Deburgo', '8 oz Filet Mignon soaked in a house specialty buttery garlic sauce with mushrooms','$35.00'],['Pastachina', 'a generous portion authentic italian style lasagna, eggs, meatballs, cheese and Penne pasta soaked in homemade italian sauce', '$25.00'],['Vegetable Risotto', 'Creamy Arborio rice with wild mushrooms', '$18.00']],
  Desserts: [['Tiramisu', 'Classic Italian dessert with mascarpone', '$7.50'], ['Cheesecake', 'Creamy cheesecake with berry compote', '$7.00']],
  Beverages: [['Red Wine (Glass)', 'A selection of Italian reds', '$10.00'], ['White Wine (Glass)', 'Crisp and refreshing', '$9.00'], ['Craft Beer', 'Local artisan brews', '$6.00'], ['Espresso', 'Strong and aromatic', '$3.00']],
};
const gallery = [
  [interiorImage, 'The dining room'],
  [steakImage, 'Ribeye steak'],
  [homeImage, 'The Cafe'],
  [specialEvent, 'The Event Space'],
  [chef, 'Chef Antonio Rossi'],
  [entrance, 'The Entrance'],
  [bruschetta, 'Bruschetta'],
  [salmon, 'Grilled Salmon'],
  [lasagna, 'Pastachina'],
];



function Header({ page, setPage }) { return <header><button className="brand" onClick={() => setPage('home')}><span>Café</span> Fausse</button><nav>{['Menu','Reservations','About Us','Gallery'].map(x => <button className={page === x.toLowerCase().replace(' ','') ? 'active' : ''} onClick={() => setPage(x.toLowerCase().replace(' ',''))} key={x}>{x}</button>)}</nav><button className="reserve-top" onClick={() => setPage('reservations')}>Reserve a table</button></header> }
function Intro({ eyebrow, title, copy }) { return <div className="intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{copy && <p>{copy}</p>}</div> }
function Home({ setPage }) { return <><section className="hero"><div><p className="eyebrow">Italian cooking, thoughtfully reimagined</p><h1>An evening worth lingering over.</h1><p className="hero-copy">Café Fausse pairs the soul of Italian tradition with the excitement of the season—served in the heart of Washington.</p><button className="gold-button" onClick={() => setPage('reservations')}>Book your table <b>→</b></button></div></section><section className="welcome"><div className="image-card"><img src={gallery[1][0]} alt="Handmade pasta"/></div><div><p className="eyebrow">Welcome to Café Fausse</p><h2>Where every course tells a story.</h2><p>Founded on a devotion to beautiful ingredients, our kitchen brings an Italian point of view to the Mid-Atlantic table. Settle in for expressive cooking, generous hospitality, and the kind of meals that become memories.</p><button className="text-button" onClick={() => setPage('aboutus')}>Our story <b>→</b></button></div></section><section className="visit"><p className="eyebrow">Come dine with us</p><h2>A table is waiting.</h2><div className="visit-grid"><div><h3>Find us</h3><p>1234 Culinary Ave, Suite 100<br/>Washington, DC 20002</p><p>(202) 555-4567</p></div><div><h3>Hours</h3><p>Monday–Saturday<br/>5:00 PM – 11:00 PM</p><p>Sunday<br/>5:00 PM – 9:00 PM</p></div><button className="outline-button" onClick={() => setPage('reservations')}>Make a reservation</button></div></section></> }
function Menu() { return <main><Intro eyebrow="Our menu" title="Simple ingredients, extraordinary care." copy="A seasonal expression of Italy, guided by the market and made to share."/><div className="menu-grid">{Object.entries(menu).map(([category, items]) => <section className="menu-section" key={category}><h2>{category}</h2>{items.map(([name, description, price]) => <article className="dish" key={name}><div><h3>{name}</h3><p>{description}</p></div><strong>{price}</strong></article>)}</section>)}</div></main> }
function Reservations() { const [message, setMessage] = useState(''); const [loading, setLoading] = useState(false); async function submit(e) { e.preventDefault(); const form = e.currentTarget; setLoading(true); setMessage(''); const data=Object.fromEntries(new FormData(e.currentTarget)); try { const r=await fetch(`${API}/reservations`, {method:'POST', headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); const body=await r.json(); if(!r.ok) throw new Error(body.error); setMessage(`Confirmed — your table ${body.table_number} awaits.`); form.reset(); } catch(err) { setMessage(err.message || 'Unable to complete your reservation. Please try again.'); } finally { setLoading(false); } } return <main className="reservation-page"><Intro eyebrow="Reservations" title="Make an evening of it." copy="Reservations are accepted up to 30 days in advance."/><form onSubmit={submit} className="reservation-form"><label>Date <input required name="date" type="date" min={new Date().toISOString().split('T')[0]}/></label><label>Time <select name="time" required defaultValue=""><option value="" disabled>Select a time</option>{['17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'].map(x=><option key={x}>{x}</option>)}</select></label><label>Guests <select name="guests" required defaultValue=""><option value="" disabled>Number of guests</option>{[1,2,3,4,5,6,7,8].map(x=><option key={x}>{x}</option>)}</select></label><label>Your name <input required name="name" placeholder="Full name"/></label><label>Email address <input required name="email" type="email" placeholder="you@example.com"/></label><label>Phone <input name="phone" type="tel" placeholder="Optional"/></label><button className="gold-button" disabled={loading}>{loading ? 'Confirming…' : 'Confirm reservation'}</button>{message && <p className="form-message" role="status">{message}</p>}</form></main> }
function About() { return <main><Intro eyebrow="Our story" title="Born in Little Italy in Des Moines, and with 150 year old authentic italian recipes we bring you an authentic Italian experience to the heartland"/><section className="about-story"><img src={gallery[2][0]} alt="Café Fausse kitchen"/><div><h2>Cooking with conviction since 2010.</h2><p>Founded by Chef Antonio Rossi and restaurateur Maria Lopez, Café Fausse blends traditional Italian flavors with modern culinary innovation. Our mission is to provide an unforgettable dining experience that reflects both quality and creativity.</p><p>We work with trusted local farmers and producers whenever possible, letting exceptional ingredients lead the conversation.</p></div></section><section className="founders"><article><p className="eyebrow">Chef & co-founder</p><h2>Antonio Rossi</h2><p>Antonio brings a lifelong respect for Italian technique and a restless curiosity for what comes next. His menus are rooted in memory, shaped by the season.</p></article><article><p className="eyebrow">Restaurateur & co-founder</p><h2>Maria Lopez</h2><p>Maria believes hospitality is an art form. She has built Café Fausse around a simple idea: every guest should leave feeling more cared for than when they arrived.</p></article></section></main> }
function Gallery() { const [chosen,setChosen]=useState(null); return <main><Intro eyebrow="Gallery" title="A glimpse inside." copy="The light, the plates, the conversations—Café Fausse in its element."/><div className="gallery">{gallery.map(([src,alt],i)=><button key={src} onClick={()=>setChosen(i)}><img src={src} alt={alt}/><span>{alt}</span></button>)}</div><section className="recognition"><div><p className="eyebrow">Recognition</p><h2>Made with distinction.</h2><ul><li>Culinary Excellence Award — 2022</li><li>Restaurant of the Year — 2023</li><li>Best Fine Dining Experience — Foodie Magazine, 2023</li></ul></div><div className="quotes"><blockquote>“Exceptional ambiance and unforgettable flavors.”<cite>— Gourmet Review</cite></blockquote><blockquote>“A must-visit restaurant for food enthusiasts.”<cite>— The Daily Bite</cite></blockquote></div></section>{chosen !== null && <div className="lightbox" role="dialog" aria-modal="true" onClick={()=>setChosen(null)}><button aria-label="Close image">×</button><img src={gallery[chosen][0]} alt={gallery[chosen][1]}/></div>}</main> }
function Footer() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function signup(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const email = new FormData(form).get('email');

  setLoading(true);
  setMessage('');

  try {
    const response = await fetch(`${API}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.error || 'Unable to subscribe right now.');
    }

    setMessage('Thank you for joining us.');
    form.reset();
  } catch (error) {
    setMessage(error.message || 'Please try again shortly.');
  } finally {
    setLoading(false);
  }
}

  return <footer><div><button className="brand"><span>Café</span> Fausse</button><p>Fine Italian dining in Washington, DC.</p></div><div><p className="eyebrow">Notes from our table</p><form onSubmit={signup}><input required type="email" name="email" placeholder="Your email address" aria-label="Email address" disabled={loading}/><button type="submit" aria-label="Subscribe" disabled={loading}>{loading ? '…' : '→'}</button></form>{message && <small role="status" aria-live="polite">{message}</small>}</div><p className="copyright">© {new Date().getFullYear()} Café Fausse</p></footer>;
}
function App() { const [page,setPage]=useState('home'); const views={home:<Home setPage={setPage}/>,menu:<Menu/>,reservations:<Reservations/>,aboutus:<About/>,gallery:<Gallery/>}; return <><Header page={page} setPage={setPage}/>{views[page]}<Footer/></> };
createRoot(document.getElementById('root')).render(<App/>);

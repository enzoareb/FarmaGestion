import { useState, useMemo, useEffect, useRef } from "react";

const PRODUCTOS = [
  { id:1, codigoBarras:"7790040123456", codigoAlfabeta:"ALF-001", troquel:"55432", nombre:"Ibuprofeno 400mg x20",    droga:"Ibuprofeno",          accionTerapeutica:"Antiinflamatorio no esteroide (AINE)", laboratorio:"Bago",     stock:45, stockMin:10, precio:1850, precioCompra:900,  categoria:"Analgésico",   vencimiento:"2026-07-10", descripcionLarga:"Comprimidos recubiertos de 400mg. Indicado para dolor leve a moderado, fiebre e inflamación. Dosis habitual: 1 comprimido cada 8h. No superar 1200mg/día. Contraindicado en úlcera péptica activa, insuficiencia hepática severa. Evitar uso prolongado sin supervisión médica." },
  { id:2, codigoBarras:"7791020234567", codigoAlfabeta:"ALF-002", troquel:"61109", nombre:"Amoxicilina 500mg x12",   droga:"Amoxicilina",         accionTerapeutica:"Antibiótico betalactámico",            laboratorio:"Roemmers", stock:8,  stockMin:15, precio:3200, precioCompra:1600, categoria:"Antibiótico",   vencimiento:"2026-04-20", descripcionLarga:"Cápsulas de 500mg. Antibiótico de amplio espectro para infecciones bacterianas (respiratorias, otitis, sinusitis, urinarias). Dosis: 1 cápsula cada 8h durante 7-10 días. Completar el tratamiento. Contraindicado en alergia a penicilinas. Puede reducir eficacia de anticonceptivos orales." },
  { id:3, codigoBarras:"7792030345678", codigoAlfabeta:"ALF-003", troquel:"48871", nombre:"Omeprazol 20mg x14",      droga:"Omeprazol",           accionTerapeutica:"Inhibidor de la bomba de protones",    laboratorio:"Gador",    stock:62, stockMin:20, precio:2100, precioCompra:1050, categoria:"Gastro",        vencimiento:"2026-09-15", descripcionLarga:"Cápsulas gastrorresistentes 20mg. Para reflujo gastroesofágico, úlcera péptica, gastritis. Tomar en ayunas 30min antes del desayuno. No triturar ni masticar. Uso prolongado puede asociarse a déficit de B12 y magnesio. Consultar si síntomas persisten más de 2 semanas." },
  { id:4, codigoBarras:"7793040456789", codigoAlfabeta:"ALF-004", troquel:"72340", nombre:"Losartan 50mg x30",       droga:"Losartán potásico",   accionTerapeutica:"Antagonista del receptor de angiotensina II", laboratorio:"Pfizer", stock:3, stockMin:10, precio:4500, precioCompra:2200, categoria:"Cardiovascular", vencimiento:"2026-03-25", descripcionLarga:"Comprimidos 50mg. Antihipertensivo y protector renal. Dosis inicial 50mg/día, puede aumentarse a 100mg. Contraindicado en embarazo, estenosis bilateral de arterias renales. Monitorear potasio en pacientes con insuficiencia renal. Evitar suplementos de potasio." },
  { id:5, codigoBarras:"7794050567890", codigoAlfabeta:"ALF-005", troquel:"39215", nombre:"Metformina 850mg x30",    droga:"Metformina HCl",      accionTerapeutica:"Antidiabético oral biguanida",         laboratorio:"Bagó",     stock:29, stockMin:15, precio:1600, precioCompra:780,  categoria:"Diabetología",  vencimiento:"2026-05-05", descripcionLarga:"Comprimidos 850mg. Primera línea en diabetes tipo 2. Tomar con las comidas. Dosis inicial 850mg 1-2 veces/día. Contraindicado en insuficiencia renal (FG<30), acidosis láctica, estudios con contraste yodado. Suspender 48h antes y 48h después de estudios con contraste." },
  { id:6, codigoBarras:"7795060678901", codigoAlfabeta:"ALF-006", troquel:"51678", nombre:"Atenolol 50mg x30",       droga:"Atenolol",            accionTerapeutica:"Betabloqueante cardioselectivo",       laboratorio:"Gador",    stock:14, stockMin:10, precio:2800, precioCompra:1300, categoria:"Cardiovascular", vencimiento:"2026-04-10", descripcionLarga:"Comprimidos 50mg. Betabloqueante para HTA, angina, arritmias, post-IAM. Dosis habitual 50-100mg/día. No suspender bruscamente. Contraindicado en bradicardia, bloqueo AV, asma, EPOC severo. Puede enmascarar hipoglucemia en diabéticos." },
  { id:7, codigoBarras:"7796070789012", codigoAlfabeta:"ALF-007", troquel:"29034", nombre:"Paracetamol 500mg x20",   droga:"Paracetamol",         accionTerapeutica:"Analgésico y antipirético",            laboratorio:"Bago",     stock:55, stockMin:10, precio:980,  precioCompra:450,  categoria:"Analgésico",   vencimiento:"2026-03-18", descripcionLarga:"Comprimidos 500mg. Analgésico y antipirético de primera elección. Dosis: 500-1000mg cada 6-8h, máx 4g/día. Seguro en embarazo. No antiinflamatorio. Precaución en hepatopatía, alcoholismo. Evitar sobredosis por riesgo de hepatotoxicidad severa." },
  { id:8, codigoBarras:"7797080890123", codigoAlfabeta:"ALF-008", troquel:"83201", nombre:"Claritromicina 500mg x14",droga:"Claritromicina",      accionTerapeutica:"Antibiótico macrólido",                laboratorio:"Abbott",   stock:18, stockMin:8,  precio:4100, precioCompra:2000, categoria:"Antibiótico",   vencimiento:"2026-03-30", descripcionLarga:"Comprimidos 500mg. Macrólido para infecciones respiratorias, piel, H. pylori. 1 comprimido cada 12h durante 7-14 días. Interacciones importantes: estatinas, warfarina, colchicina. Prolonga QT: evitar en arritmias. Contraindicado con ergotamínicos, cisaprida." },
];
const CLIENTES_INIT = [
  { id:1, nombre:"García, María",      dni:"24.567.890", telefono:"11-4521-3456", email:"garcia.maria@gmail.com",    domicilio:"Av. Santa Fe 1234, CABA",    fechaNac:"1975-04-15", os:[{nombre:"OSDE 310",  descuento:40}], saldo:0,     activo:true,
    legajos:[
      { id:101, nombre:"Tratamiento HTA crónica",  os:"OSDE 310",  programa:"Plan 310", topeTotal:20000, topeM:5000,  vencimiento:"2026-12-31", activo:true,  consumido:3200,
        medicamentos:[{nombre:"Losartan 50mg x30",troquel:"72340",cantidad:1},{nombre:"Atenolol 50mg x30",troquel:"51678",cantidad:1}] },
      { id:102, nombre:"Programa Diabetes",        os:"OSDE 310",  programa:"Medicamentos crónicos", topeTotal:50000, topeM:null, vencimiento:"2026-06-30", activo:true, consumido:9800,
        medicamentos:[{nombre:"Metformina 850mg x30",troquel:"39215",cantidad:2}] },
    ]},
  { id:2, nombre:"López, Juan Carlos", dni:"18.234.567", telefono:"11-3678-9012", email:"jclopez@hotmail.com",       domicilio:"Corrientes 567, CABA",       fechaNac:"1968-11-02", os:[{nombre:"IOMA",      descuento:50}], saldo:-1200, activo:true,
    legajos:[
      { id:201, nombre:"Antibioticoterapia aguda", os:"IOMA", programa:"Básico", topeTotal:8000, topeM:2000, vencimiento:"2026-04-30", activo:true, consumido:1600,
        medicamentos:[{nombre:"Amoxicilina 500mg x12",troquel:"61109",cantidad:1}] },
    ]},
  { id:3, nombre:"Fernández, Ana",     dni:"32.890.123", telefono:"11-5432-1098", email:"ana.fern@gmail.com",        domicilio:"Belgrano 890, CABA",         fechaNac:"1990-07-22", os:[{nombre:"Swiss Med", descuento:35}], saldo:500,   activo:true,  legajos:[] },
  { id:4, nombre:"Martínez, Roberto",  dni:"27.345.678", telefono:"11-2345-6789", email:"rmartinez@outlook.com",     domicilio:"Rivadavia 2345, CABA",       fechaNac:"1955-03-08", os:[{nombre:"PAMI",      descuento:70}], saldo:0,     activo:true,
    legajos:[
      { id:401, nombre:"Crónicas priorizadas PAMI",os:"PAMI", programa:"Crónicas priorizadas", topeTotal:null, topeM:null, vencimiento:"2027-01-31", activo:true, consumido:15400,
        medicamentos:[{nombre:"Losartan 50mg x30",troquel:"72340",cantidad:1},{nombre:"Omeprazol 20mg x14",troquel:"48871",cantidad:1},{nombre:"Metformina 850mg x30",troquel:"39215",cantidad:1}] },
    ]},
];
const PROVEEDORES = [
  { id:1, nombre:"Droguería del Sud", contacto:"Martín Pérez",  telefono:"11-4000-1234", saldo:45000 },
  { id:2, nombre:"Rofina S.A.",       contacto:"Sandra Gómez",  telefono:"11-4100-5678", saldo:12000 },
  { id:3, nombre:"Drofarma",          contacto:"Carlos Ruiz",   telefono:"11-4200-9012", saldo:0 },
];
const VENTAS = [
  { id:"F-0010", fecha:"05/03/2026", cliente:"Mostrador",          total:980,  pagado:true,  items:1, medio:"efectivo" },
  { id:"F-0009", fecha:"05/03/2026", cliente:"Martínez, Roberto",  total:4500, pagado:false, items:2, medio:"credito" },
  { id:"F-0008", fecha:"05/03/2026", cliente:"García, María",      total:1600, pagado:true,  items:1, medio:"os" },
  { id:"F-0007", fecha:"05/03/2026", cliente:"Mostrador",          total:2800, pagado:true,  items:2, medio:"debito" },
  { id:"F-0006", fecha:"05/03/2026", cliente:"López, Juan C.",     total:3200, pagado:true,  items:3, medio:"credito" },
  { id:"F-0005", fecha:"05/03/2026", cliente:"Mostrador",          total:1400, pagado:false, items:1, medio:"mercadopago" },
  { id:"F-0004", fecha:"04/03/2026", cliente:"Fernández, Ana",     total:2100, pagado:false, items:1, medio:"os" },
  { id:"F-0003", fecha:"04/03/2026", cliente:"Mostrador",          total:6300, pagado:true,  items:3, medio:"efectivo" },
  { id:"F-0002", fecha:"04/03/2026", cliente:"López, Juan C.",     total:1850, pagado:true,  items:1, medio:"debito" },
  { id:"F-0001", fecha:"04/03/2026", cliente:"García, María",      total:3200, pagado:true,  items:2, medio:"os" },
];
const VENTAS_POR_PRODUCTO = [
  { productoId:7, unidades:220 },
  { productoId:1, unidades:140 },
  { productoId:5, unidades:95 },
  { productoId:2, unidades:80 },
  { productoId:3, unidades:70 },
  { productoId:4, unidades:60 },
  { productoId:6, unidades:55 },
  { productoId:8, unidades:40 },
];
const MEDIOS_PAGO = [
  { id:"efectivo",     label:"Efectivo",      icon:"💵", color:"#16a34a", cuotas:false },
  { id:"debito",       label:"Débito",         icon:"💳", color:"#0284c7", cuotas:false },
  { id:"credito",      label:"Crédito",        icon:"💳", color:"#7c3aed", cuotas:true  },
  { id:"transferencia",label:"Transferencia",  icon:"🏦", color:"#0891b2", cuotas:false },
  { id:"mercadopago",  label:"Mercado Pago",   icon:"💙", color:"#009ee3", cuotas:true  },
  { id:"naranjax",     label:"Naranja X",      icon:"🟠", color:"#f97316", cuotas:true  },
  { id:"cheque",       label:"Cheque",         icon:"📄", color:"#64748b", cuotas:false },
  { id:"os",           label:"Obra Social",    icon:"🏥", color:"#be185d", cuotas:false },
  { id:"cta_cte",      label:"Cta. Cte.",      icon:"📋", color:"#92400e", cuotas:false },
  { id:"vale",         label:"Vale/Cupón",     icon:"🎫", color:"#4338ca", cuotas:false },
];
const RECARGOS = { credito:{3:5,6:12,12:22}, mercadopago:{3:6,6:13,12:24}, naranjax:{3:5.5,6:11,12:21} };

const VENDEDORES = [
  { id:1, nombre:"María García" },
  { id:2, nombre:"Juan López" },
  { id:3, nombre:"Ana Fernández" },
  { id:4, nombre:"Roberto Martínez" },
];

const VENTA_PUBLICO = { id:0, codigo:"PUB", nombre:"Venta al público", programas:[], activa:true };

const fmt = n => (n||0).toLocaleString("es-AR",{style:"currency",currency:"ARS",minimumFractionDigits:0});

const Icon = ({name,size=18}) => {
  const P = {
    home:    <><path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/></>,
    bill:    <><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></>,
    box:     <><path d="M21 8L12 3 3 8l9 5 9-5z"/><polyline points="3,8 3,16 12,21 21,16 21,8"/><line x1="12" y1="13" x2="12" y2="21"/></>,
    users:   <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    truck:   <><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    cash:    <><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></>,
    coin:    <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
    alert:   <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    check:   <><polyline points="20,6 9,17 4,12"/></>,
    plus:    <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    search:  <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    x:       <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    edit:    <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    shield:  <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    pct:     <><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></>,
    book:    <><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{P[name]}</svg>;
};

const Badge = ({color,text}) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}}>{text}</span>
);

// Overlay con soporte Escape + click fuera
const Overlay = ({onClose, zIndex=200, children}) => {
  useEffect(()=>{
    const handler = e => { if(e.key==="Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return ()=>document.removeEventListener("keydown", handler);
  },[onClose]);
  return (
    <div onClick={onClose}
      style={{position:"fixed",inset:0,background:"#0009",zIndex,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
const FECHAS_UNICAS = [...new Set(VENTAS.map(v=>v.fecha))].sort((a,b)=>b.localeCompare(a));

function Dashboard({onCobrarFactura, productos}) {
  const [ventas, setVentas]     = useState(VENTAS.map(v=>({...v})));
  const [filtroNum, setFiltroNum] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const alertas = (productos||PRODUCTOS).filter(p=>p.stock<=p.stockMin);

  const ventasFiltradas = ventas.filter(v => {
    const matchNum    = !filtroNum   || v.id.toLowerCase().includes(filtroNum.toLowerCase());
    const matchFecha  = !filtroFecha || v.fecha === filtroFecha;
    const matchEstado = filtroEstado === "todos"
      || (filtroEstado === "pagada"    &&  v.pagado)
      || (filtroEstado === "pendiente" && !v.pagado);
    return matchNum && matchFecha && matchEstado;
  });

  const hayFiltros = filtroNum || filtroFecha || filtroEstado !== "todos";

  return (
    <div>
      <h2 style={{margin:"0 0 24px",fontSize:22,color:"#1e293b",fontWeight:800}}>Panel Principal</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
        {[
          {label:"Ventas hoy",       value:fmt(13350), sub:"4 facturas",       icon:"bill",  color:"#0ea5e9"},
          {label:"Caja actual",      value:fmt(87200), sub:"Apertura: $70.000",icon:"cash",  color:"#10b981"},
          {label:"Stock en alerta",  value:alertas.length, sub:"Bajo mínimo",  icon:"alert", color:"#f59e0b"},
          {label:"Clientes activos", value:CLIENTES_INIT.length,sub:"Con obra social",icon:"users",color:"#8b5cf6"},
        ].map(k=>(
          <div key={k.label} style={{background:"#fff",borderRadius:16,padding:"18px 20px",border:"1px solid #e2e8f0",boxShadow:"0 2px 8px #0001"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>{k.label}</div>
                <div style={{fontSize:28,fontWeight:800,color:"#0f172a"}}>{k.value}</div>
                <div style={{fontSize:12,color:"#94a3b8",marginTop:4}}>{k.sub}</div>
              </div>
              <div style={{background:k.color+"18",color:k.color,padding:10,borderRadius:10}}><Icon name={k.icon} size={20}/></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {/* ── Últimas Ventas ── */}
        <div style={{background:"#fff",borderRadius:16,padding:20,border:"1px solid #e2e8f0"}}>

          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:700,color:"#1e293b"}}>Últimas Ventas</h3>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              {hayFiltros && (
                <button onClick={()=>{setFiltroNum("");setFiltroFecha("");setFiltroEstado("todos");}}
                  style={{fontSize:11,color:"#ef4444",background:"#fee2e2",border:"none",borderRadius:6,padding:"2px 9px",fontWeight:700,cursor:"pointer"}}>
                  ✕ Limpiar
                </button>
              )}
              <span style={{fontSize:11,color:"#94a3b8",fontWeight:600,background:"#f1f5f9",borderRadius:20,padding:"2px 10px"}}>
                {ventasFiltradas.length}/{ventas.length}
              </span>
            </div>
          </div>

          {/* Filtros */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
            {/* Nº Factura */}
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",fontSize:11,color:"#94a3b8",pointerEvents:"none"}}>🔍</span>
              <input
                value={filtroNum}
                onChange={e=>setFiltroNum(e.target.value)}
                placeholder="Nº factura"
                style={{width:"100%",padding:"7px 8px 7px 26px",borderRadius:8,border:`1.5px solid ${filtroNum?"#0ea5e9":"#e2e8f0"}`,fontSize:12,outline:"none",boxSizing:"border-box",color:"#1e293b",background:filtroNum?"#f0f9ff":"#f8fafc"}}
              />
            </div>

            {/* Fecha */}
            <select
              value={filtroFecha}
              onChange={e=>setFiltroFecha(e.target.value)}
              style={{padding:"7px 8px",borderRadius:8,border:`1.5px solid ${filtroFecha?"#0ea5e9":"#e2e8f0"}`,fontSize:12,outline:"none",color:"#1e293b",background:filtroFecha?"#f0f9ff":"#f8fafc",cursor:"pointer"}}>
              <option value="">Todas las fechas</option>
              {FECHAS_UNICAS.map(f=><option key={f} value={f}>{f}</option>)}
            </select>

            {/* Estado */}
            <div style={{display:"flex",borderRadius:8,overflow:"hidden",border:"1.5px solid #e2e8f0"}}>
              {[["todos","Todos"],["pagada","Pagadas"],["pendiente","Pendientes"]].map(([val,label])=>(
                <button key={val} onClick={()=>setFiltroEstado(val)}
                  style={{flex:1,padding:"7px 4px",border:"none",fontSize:11,fontWeight:700,cursor:"pointer",
                    background: filtroEstado===val
                      ? val==="pendiente" ? "#f59e0b" : val==="pagada" ? "#10b981" : "#0ea5e9"
                      : "#f8fafc",
                    color: filtroEstado===val ? "#fff" : "#94a3b8",
                    transition:"all .15s",
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla */}
          <div style={{maxHeight:280,overflowY:"auto",marginRight:-4,paddingRight:4}}>
            {ventasFiltradas.length === 0 ? (
              <div style={{textAlign:"center",padding:"32px 0",color:"#94a3b8",fontSize:13}}>
                <div style={{fontSize:28,marginBottom:8}}>🔍</div>
                Sin resultados para los filtros aplicados
              </div>
            ) : (
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{borderBottom:"2px solid #f1f5f9",position:"sticky",top:0,background:"#fff"}}>
                    {["Factura","Fecha","Cliente","Total","Estado",""].map(h=>(
                      <th key={h} style={{textAlign:"left",padding:"6px 8px",color:"#64748b",fontWeight:600,fontSize:11}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ventasFiltradas.map(v=>(
                    <tr key={v.id} style={{borderBottom:"1px solid #f8fafc",background:!v.pagado?"#fffbeb":"transparent"}}>
                      <td style={{padding:"8px",fontWeight:700,color:"#0ea5e9"}}>{v.id}</td>
                      <td style={{padding:"8px",color:"#94a3b8",fontSize:11,whiteSpace:"nowrap"}}>{v.fecha}</td>
                      <td style={{padding:"8px",color:"#334155",maxWidth:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.cliente}</td>
                      <td style={{padding:"8px",fontWeight:600,whiteSpace:"nowrap"}}>{fmt(v.total)}</td>
                      <td style={{padding:"8px"}}>
                        {v.pagado
                          ? <Badge color="#10b981" text="✓ Pagada"/>
                          : <Badge color="#f59e0b" text="Pendiente"/>}
                      </td>
                      <td style={{padding:"8px"}}>
                        {!v.pagado
                          ? <button
                              onClick={()=>onCobrarFactura(v,()=>setVentas(prev=>prev.map(x=>x.id===v.id?{...x,pagado:true}:x)))}
                              style={{display:"flex",alignItems:"center",gap:4,background:"#0ea5e9",color:"#fff",border:"none",borderRadius:7,padding:"4px 10px",fontWeight:700,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",boxShadow:"0 2px 6px #0ea5e940"}}>
                              💳 Cobrar
                            </button>
                          : <button style={{display:"flex",alignItems:"center",gap:4,background:"#f1f5f9",color:"#94a3b8",border:"none",borderRadius:7,padding:"4px 9px",fontWeight:600,fontSize:11,cursor:"default"}}>
                              🖨️ Reimpr.
                            </button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Alertas de Stock ── */}
        <div style={{background:"#fff",borderRadius:16,padding:20,border:"1px solid #e2e8f0"}}>
          <h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#1e293b"}}>⚠️ Alertas de Stock</h3>
          {alertas.map(p=>(
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:"#fef3c7",borderRadius:10,marginBottom:8,border:"1px solid #fde68a"}}>
              <div><div style={{fontWeight:700,fontSize:13,color:"#92400e"}}>{p.nombre}</div><div style={{fontSize:11,color:"#b45309"}}>{p.laboratorio}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontWeight:800,color:"#dc2626",fontSize:16}}>{p.stock}</div><div style={{fontSize:10,color:"#b45309"}}>mín:{p.stockMin}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── VALIDACIÓN DE RECETA ──────────────────────────────────────────────────────
function ValidacionReceta({ osSel, items, subtotal, descOS, total, onVolver, onAceptada }) {
  const [fase, setFase] = useState("form"); // form | validando | resultado
  const [form, setForm] = useState({
    nroAfiliado:"", credencial:"", dni:"", apellidoPaciente:"", nombrePaciente:"",
    fechaNac:"", nroReceta:"", token:"", medico:"", matricula:"", diagnostico:"",
  });
  const [errores, setErrores] = useState({});
  const [resultado, setResultado] = useState(null);
  const [imprimiendo, setImprimiendo] = useState(false);

  const REQS = { nroAfiliado:"Nº Afiliado", credencial:"Credencial", dni:"DNI Paciente",
    apellidoPaciente:"Apellido", nombrePaciente:"Nombre", nroReceta:"Nº Receta",
    medico:"Médico prescriptor", matricula:"Matrícula" };

  const fld = (k, label, ph="", type="text") => {
    const err = errores[k];
    return (
      <div>
        <label style={{fontSize:11,color:err?"#ef4444":"#64748b",fontWeight:700,display:"block",marginBottom:4}}>
          {label}{REQS[k]&&<span style={{color:"#ef4444"}}> *</span>}
          {err&&<span style={{marginLeft:6,fontSize:10,color:"#ef4444"}}>{err}</span>}
        </label>
        <input type={type} value={form[k]} placeholder={ph}
          onChange={e=>setForm({...form,[k]:e.target.value})}
          style={{width:"100%",padding:"9px 11px",borderRadius:9,
            border:`1.5px solid ${err?"#ef4444":"#e2e8f0"}`,
            background:err?"#fff5f5":"#fff",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
      </div>
    );
  };

  const validar = () => {
    const e={};
    Object.keys(REQS).forEach(k=>{ if(!form[k].trim()) e[k]=`Requerido`; });
    setErrores(e);
    return Object.keys(e).length===0;
  };

  const simularValidacion = () => {
    if(!validar()) return;
    setFase("validando");
    setTimeout(()=>{
      // Simulación: token "0000" → rechazada; vacío o cualquier otro valor → aprobada
      const aprobada = form.token !== "0000";
      const ahora = new Date();
      setResultado({
        aprobada,
        codigo:        aprobada ? "VAL-" + Math.floor(100000+Math.random()*900000) : null,
        mensaje:       aprobada ? "Receta autorizada para dispensa" : "Receta rechazada: token inválido o receta ya dispensada",
        os:            osSel.nombre,
        fechaHora:     ahora.toLocaleString("es-AR"),
        nroReceta:     form.nroReceta,
        token:         form.token,
        paciente:      `${form.apellidoPaciente.toUpperCase()}, ${form.nombrePaciente}`,
        dni:           form.dni,
        nroAfiliado:   form.nroAfiliado,
        credencial:    form.credencial,
        medico:        form.medico,
        matricula:     form.matricula,
        diagnostico:   form.diagnostico || "—",
        items:         items.map(i=>({ nombre:((i.descripcionCorta||i.nombre)||"").slice(0,20), cantidad:i.cantidad, precio:i.precio })),
        subtotal, descOS, total,
        farmacia:      "Farmacia San Martín",
        farmaceutico:  "Farm. Ana González — MP 12345",
        cuit:          "30-71234567-9",
      });
      setFase("resultado");
    }, 2200);
  };

  const imprimirTicket = () => {
    if(!resultado) return;
    setImprimiendo(true);
    const win = window.open("","_blank","width=420,height=680");
    win.document.write(`
      <html><head><title>Ticket Validación</title>
      <style>
        body{font-family:'Courier New',monospace;font-size:12px;margin:0;padding:16px;color:#000}
        .center{text-align:center} .sep{border-top:1px dashed #000;margin:8px 0}
        .row{display:flex;justify-content:space-between;margin:2px 0}
        .bold{font-weight:bold} .big{font-size:16px;font-weight:bold}
        .ok{color:#166534;background:#dcfce7;padding:4px 10px;border-radius:4px;display:inline-block}
        .err{color:#991b1b;background:#fee2e2;padding:4px 10px;border-radius:4px;display:inline-block}
      </style></head><body>
      <div class="center bold" style="font-size:15px">${resultado.farmacia}</div>
      <div class="center">CUIT: ${resultado.cuit}</div>
      <div class="center">${resultado.farmaceutico}</div>
      <div class="sep"></div>
      <div class="center bold" style="font-size:13px">COMPROBANTE DE VALIDACIÓN</div>
      <div class="center bold">${resultado.os}</div>
      <div class="center">${resultado.fechaHora}</div>
      <div class="sep"></div>
      <div class="row"><span>Estado:</span><span class="${resultado.aprobada?'ok':'err'}">${resultado.aprobada?"✓ APROBADA":"✗ RECHAZADA"}</span></div>
      ${resultado.aprobada?`<div class="row"><span>Cód. Autorización:</span><span class="bold">${resultado.codigo}</span></div>`:""}
      <div class="row"><span>Nº Receta:</span><span>${resultado.nroReceta}</span></div>
      <div class="sep"></div>
      <div class="bold">PACIENTE</div>
      <div class="row"><span>Apellido y nombre:</span><span>${resultado.paciente}</span></div>
      <div class="row"><span>DNI:</span><span>${resultado.dni}</span></div>
      <div class="row"><span>Nº Afiliado:</span><span>${resultado.nroAfiliado}</span></div>
      <div class="row"><span>Credencial:</span><span>${resultado.credencial}</span></div>
      <div class="sep"></div>
      <div class="bold">MÉDICO PRESCRIPTOR</div>
      <div class="row"><span>Médico:</span><span>${resultado.medico}</span></div>
      <div class="row"><span>Matrícula:</span><span>${resultado.matricula}</span></div>
      <div class="row"><span>Diagnóstico:</span><span>${resultado.diagnostico}</span></div>
      <div class="sep"></div>
      <div class="bold">MEDICAMENTOS DISPENSADOS</div>
      ${resultado.items.map(i=>`<div class="row"><span>${i.nombre}</span><span>x${i.cantidad} ${(i.precio*i.cantidad).toLocaleString('es-AR',{style:'currency',currency:'ARS',minimumFractionDigits:0})}</span></div>`).join("")}
      <div class="sep"></div>
      <div class="row"><span>Subtotal:</span><span>${resultado.subtotal.toLocaleString('es-AR',{style:'currency',currency:'ARS',minimumFractionDigits:0})}</span></div>
      <div class="row"><span>Descuento OS (${osSel.descuento}%):</span><span>-${resultado.descOS.toLocaleString('es-AR',{style:'currency',currency:'ARS',minimumFractionDigits:0})}</span></div>
      <div class="row bold"><span>TOTAL PACIENTE:</span><span>${resultado.total.toLocaleString('es-AR',{style:'currency',currency:'ARS',minimumFractionDigits:0})}</span></div>
      <div class="sep"></div>
      <div class="center" style="font-size:10px">Documento válido para auditoría de obra social</div>
      <div class="center" style="font-size:10px">Conserve este comprobante</div>
      </body></html>
    `);
    win.document.close();
    win.print();
    setTimeout(()=>setImprimiendo(false), 1000);
  };

  // ── FASE: validando ───────────────────────────────────────
  if(fase==="validando") return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:320,gap:20}}>
      <div style={{width:56,height:56,border:"5px solid #e2e8f0",borderTopColor:"#8b5cf6",borderRadius:"50%",
        animation:"spin 0.8s linear infinite"}}/>
      <div style={{textAlign:"center"}}>
        <div style={{fontWeight:800,fontSize:17,color:"#1e293b",marginBottom:6}}>Validando receta...</div>
        <div style={{fontSize:13,color:"#64748b"}}>Consultando mandataria de {osSel.nombre}</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── FASE: resultado ───────────────────────────────────────
  if(fase==="resultado" && resultado) return (
    <div style={{maxWidth:760,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={onVolver} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontWeight:700,color:"#64748b",fontSize:13}}>← Volver</button>
        <h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#1e293b"}}>Resultado de validación</h2>
      </div>

      {/* Banner estado */}
      <div style={{borderRadius:16,padding:"18px 22px",marginBottom:20,
        background: resultado.aprobada ? "linear-gradient(135deg,#d1fae5,#a7f3d0)" : "linear-gradient(135deg,#fee2e2,#fecaca)",
        border: `2px solid ${resultado.aprobada?"#6ee7b7":"#f87171"}`}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{fontSize:36}}>{resultado.aprobada?"✅":"❌"}</div>
          <div>
            <div style={{fontWeight:800,fontSize:18,color:resultado.aprobada?"#065f46":"#991b1b"}}>
              {resultado.aprobada ? "Receta APROBADA" : "Receta RECHAZADA"}
            </div>
            <div style={{fontSize:13,color:resultado.aprobada?"#047857":"#b91c1c",marginTop:3}}>
              {resultado.mensaje}
            </div>
          </div>
          {resultado.aprobada && (
            <div style={{marginLeft:"auto",background:"#fff",borderRadius:12,padding:"10px 18px",textAlign:"center"}}>
              <div style={{fontSize:10,color:"#047857",fontWeight:700,textTransform:"uppercase"}}>Cód. Autorización</div>
              <div style={{fontWeight:800,fontSize:18,color:"#065f46",fontFamily:"monospace"}}>{resultado.codigo}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {/* Datos paciente */}
        <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e2e8f0"}}>
          <div style={{fontSize:11,color:"#8b5cf6",fontWeight:800,textTransform:"uppercase",marginBottom:12}}>👤 Paciente</div>
          {[["Nombre",resultado.paciente],["DNI",resultado.dni],["Nº Afiliado",resultado.nroAfiliado],["Credencial",resultado.credencial]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f1f5f9",fontSize:13}}>
              <span style={{color:"#64748b"}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
        {/* Datos médico */}
        <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e2e8f0"}}>
          <div style={{fontSize:11,color:"#0284c7",fontWeight:800,textTransform:"uppercase",marginBottom:12}}>🩺 Médico prescriptor</div>
          {[["Médico",resultado.medico],["Matrícula",resultado.matricula],["Diagnóstico",resultado.diagnostico],["Nº Receta",resultado.nroReceta]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f1f5f9",fontSize:13}}>
              <span style={{color:"#64748b"}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Medicamentos y totales */}
      <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e2e8f0",marginBottom:20}}>
        <div style={{fontSize:11,color:"#10b981",fontWeight:800,textTransform:"uppercase",marginBottom:12}}>💊 Medicamentos dispensados</div>
        {resultado.items.map((i,idx)=>(
          <div key={idx} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f1f5f9",fontSize:13}}>
            <span>{i.nombre} <span style={{color:"#94a3b8"}}>×{i.cantidad}</span></span>
            <span style={{fontWeight:600}}>{fmt(i.precio*i.cantidad)}</span>
          </div>
        ))}
        <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:4}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
            <span style={{color:"#64748b"}}>Subtotal</span><span>{fmt(resultado.subtotal)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
            <span style={{color:"#be185d"}}>Cobertura {osSel.nombre} ({osSel.descuento}%)</span>
            <span style={{color:"#be185d"}}>−{fmt(resultado.descOS)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,borderTop:"2px solid #0ea5e9",paddingTop:8,marginTop:4}}>
            <span>Total paciente</span><span style={{color:"#0ea5e9"}}>{fmt(resultado.total)}</span>
          </div>
        </div>
      </div>

      {/* Botones acción */}
      <div style={{display:"flex",gap:12}}>
        <button onClick={imprimirTicket} disabled={imprimiendo}
          style={{flex:1,padding:"13px",background:"#f1f5f9",color:"#1e293b",border:"1px solid #e2e8f0",borderRadius:12,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          🖨️ {imprimiendo?"Imprimiendo...":"Imprimir ticket"}
        </button>
        {resultado.aprobada ? (
          <button onClick={()=>onAceptada(resultado)}
            style={{flex:2,padding:"13px",background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",border:"none",borderRadius:12,fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:"0 4px 16px #10b98140",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            💳 Continuar al cobro →
          </button>
        ) : (
          <button onClick={()=>setFase("form")}
            style={{flex:2,padding:"13px",background:"#f59e0b",color:"#fff",border:"none",borderRadius:12,fontWeight:800,fontSize:14,cursor:"pointer"}}>
            🔄 Reintentar validación
          </button>
        )}
      </div>
    </div>
  );

  // ── FASE: formulario ──────────────────────────────────────
  return (
    <div style={{maxWidth:760,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={onVolver} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontWeight:700,color:"#64748b",fontSize:13}}>← Volver</button>
        <div>
          <h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#1e293b"}}>Validación de Receta</h2>
          <div style={{fontSize:12,color:"#64748b",marginTop:2}}>🏥 {osSel.nombre} — Cobertura {osSel.descuento}%</div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>

        {/* Columna izquierda */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          {/* Datos afiliado */}
          <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e2e8f0"}}>
            <div style={{fontSize:11,color:"#8b5cf6",fontWeight:800,textTransform:"uppercase",marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:16,height:16,borderRadius:4,background:"#8b5cf6",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9}}>1</span>
              Datos del afiliado
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {fld("nroAfiliado","Nº Afiliado","ej: 12345678")}
                {fld("credencial","Credencial","ej: 001")}
              </div>
              {fld("dni","DNI Paciente","ej: 28123456")}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {fld("apellidoPaciente","Apellido","ej: García")}
                {fld("nombrePaciente","Nombre","ej: María")}
              </div>
              {fld("fechaNac","Fecha de nacimiento","ej: 15/04/1980","date")}
            </div>
          </div>

          {/* Datos receta */}
          <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e2e8f0"}}>
            <div style={{fontSize:11,color:"#0284c7",fontWeight:800,textTransform:"uppercase",marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:16,height:16,borderRadius:4,background:"#0284c7",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9}}>2</span>
              Datos de la receta
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {fld("nroReceta","Nº de Receta","ej: REC-2026-00123")}
                {fld("token","Token / PIN (opcional)","ej: 847261")}
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          {/* Datos médico */}
          <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e2e8f0"}}>
            <div style={{fontSize:11,color:"#10b981",fontWeight:800,textTransform:"uppercase",marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:16,height:16,borderRadius:4,background:"#10b981",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9}}>3</span>
              Médico prescriptor
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {fld("medico","Apellido y nombre","ej: Dr. Pérez, Carlos")}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {fld("matricula","Matrícula","ej: MP 54321")}
              </div>
              {fld("diagnostico","Diagnóstico / CIE-10 (opcional)","ej: J06 - Infección respiratoria aguda")}
            </div>
          </div>

          {/* Resumen venta */}
          <div style={{background:"#f8fafc",borderRadius:14,padding:18,border:"1px solid #e2e8f0"}}>
            <div style={{fontSize:11,color:"#f59e0b",fontWeight:800,textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:16,height:16,borderRadius:4,background:"#f59e0b",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9}}>4</span>
              Resumen de venta
            </div>
            {items.map(i=>(
              <div key={i.id} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"5px 0",borderBottom:"1px solid #f1f5f9"}}>
                <span style={{color:"#334155"}}>{i.nombre} ×{i.cantidad}</span>
                <span style={{fontWeight:600}}>{fmt(i.precio*i.cantidad)}</span>
              </div>
            ))}
            <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:3}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                <span style={{color:"#64748b"}}>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#be185d"}}>
                <span>Cobertura {osSel.descuento}%</span><span>−{fmt(descOS)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:15,borderTop:"2px solid #0ea5e9",paddingTop:8,marginTop:4}}>
                <span>Total paciente</span><span style={{color:"#0ea5e9"}}>{fmt(total)}</span>
              </div>
            </div>
          </div>

          <div style={{background:"#fef3c7",borderRadius:12,padding:"12px 14px",border:"1px solid #fde68a",fontSize:12,color:"#92400e"}}>
            💡 <strong>Demo:</strong> Token es opcional. Ingresar <code style={{background:"#fff",padding:"1px 5px",borderRadius:4}}>0000</code> simula rechazo. Vacío o cualquier otro valor aprueba.
          </div>

          <button onClick={simularValidacion}
            style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",color:"#fff",border:"none",borderRadius:12,fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:"0 4px 16px #8b5cf640",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            🏥 Enviar a validar
          </button>
        </div>
      </div>
    </div>
  );
}


// ── FACTURACIÓN ───────────────────────────────────────────────────────────────
function Facturacion({ obrasSociales, clientes }) {
  const [items,setItems]           = useState([]);
  const [buscar,setBuscar]         = useState("");
  const [osSel,setOSSel]           = useState(VENTA_PUBLICO);
  const [programaSel,setPrograma]  = useState(null);
  const [coseguroEdit,setCoseguro] = useState(0);
  const [step,setStep]             = useState("venta");
  const [pagos,setPagos]           = useState([]);
  const [medioActivo,setMedio]     = useState(null);
  const [monto,setMonto]           = useState("");
  const [cuotas,setCuotas]         = useState(1);
  const [recetaValidada,setRecetaValidada] = useState(null);
  const [criterioBuscar,setCriterioBuscar] = useState("nombre");
  const [nroFactura,setNroFactura] = useState(11);

  const [vendedor,setVendedor]     = useState("");
  const [cliente,setCliente]       = useState("");
  const [osInput,setOSInput]      = useState("Venta al público");
  const [showVendedores,setShowVendedores] = useState(false);
  const [showClientes,setShowClientes]   = useState(false);
  const [showOS,setShowOS]         = useState(false);
  const [osListaCompleta,setOSListaCompleta] = useState(true); // true = mostrar todas al hacer click; false = filtrar al escribir
  const [highlightVendedor,setHighlightVendedor] = useState(0);
  const [highlightCliente,setHighlightCliente]   = useState(0);
  const [highlightOS,setHighlightOS]     = useState(0);
  const [highlightProd,setHighlightProd] = useState(0);
  const refVendedor = useRef(null);
  const refCliente  = useRef(null);
  const refOS       = useRef(null);
  const refBuscar   = useRef(null);
  const refHighlightVendedor = useRef(null);
  const refHighlightCliente = useRef(null);
  const refHighlightOS = useRef(null);
  const refHighlightProd = useRef(null);

  const listaOS = [VENTA_PUBLICO, ...(obrasSociales||[]).filter(o=>o.activa)];
  const clientesData = clientes || CLIENTES_INIT;

  const vendedoresFilt = useMemo(()=>{
    const q = vendedor.toLowerCase().trim();
    if (!q) return VENDEDORES;
    return VENDEDORES.filter(v=>v.nombre.toLowerCase().includes(q));
  },[vendedor]);

  const clientesFilt = useMemo(()=>{
    const q = cliente.toLowerCase().trim();
    if (!q) return clientesData;
    return clientesData.filter(c=>c.nombre?.toLowerCase().includes(q) || c.dni?.includes(q));
  },[cliente, clientesData]);

  const osFilt = useMemo(()=>{
    const q = osInput.toLowerCase().trim();
    if (!q) return listaOS;
    return listaOS.filter(o=>
      o.nombre?.toLowerCase().includes(q) ||
      (o.codigo||"").toLowerCase().includes(q)
    );
  },[osInput, listaOS]);

  const selVendedor = v => { setVendedor(v.nombre); setShowVendedores(false); setHighlightVendedor(0); refCliente.current?.focus(); };
  const selCliente  = c => { setCliente(c.nombre); setShowClientes(false); setHighlightCliente(0); refOS.current?.focus(); };
  const selOSItem   = o => {
    setOSSel(o);
    setPrograma(null);
    setCoseguro(0);
    setOSInput(o.nombre);
    setShowOS(false);
    setHighlightOS(0);
    refBuscar.current?.focus();
  };

  const CRITERIOS = [
    { id:"nombre",  label:"Nombre",        ph:"ej: Ibuprofeno 400mg" },
    { id:"troquel", label:"Troquel",       ph:"ej: 55432" },
    { id:"barras",  label:"Cód. Barras",   ph:"ej: 7790040123456" },
    { id:"droga",   label:"Droga",         ph:"ej: Ibuprofeno" },
    { id:"accion",  label:"Acción terap.", ph:"ej: Antiinflamatorio" },
  ];

  const selProg = p  => { setPrograma(p); setCoseguro(p.coseguro); };

  const prodsFilt = useMemo(() => buscar.trim().length > 1 ? PRODUCTOS.filter(p => {
    const q = buscar.toLowerCase();
    switch(criterioBuscar) {
      case "troquel": return p.troquel?.includes(buscar.trim());
      case "barras":  return p.codigoBarras?.includes(buscar.trim());
      case "droga":   return p.droga?.toLowerCase().includes(q);
      case "accion":  return p.accionTerapeutica?.toLowerCase().includes(q);
      default:        return p.nombre.toLowerCase().includes(q) || p.codigoAlfabeta?.toLowerCase().includes(q);
    }
  }) : [], [buscar, criterioBuscar]);

  useEffect(() => {
    if (showVendedores) refHighlightVendedor.current?.scrollIntoView({ block: "nearest" });
    if (showClientes) refHighlightCliente.current?.scrollIntoView({ block: "nearest" });
    if (showOS) refHighlightOS.current?.scrollIntoView({ block: "nearest" });
    if (prodsFilt.length > 0) refHighlightProd.current?.scrollIntoView({ block: "nearest" });
  }, [highlightVendedor, highlightCliente, highlightOS, highlightProd, prodsFilt.length]);

  const addItem    = p => { const e=items.find(i=>i.id===p.id); setItems(e?items.map(i=>i.id===p.id?{...i,cantidad:i.cantidad+1}:i):[...items,{...p,cantidad:1}]); setBuscar(""); };
  const removeItem = id => setItems(items.filter(i=>i.id!==id));

  const subtotal  = items.reduce((a,i)=>a+i.precio*i.cantidad,0);
  const pctDesc   = programaSel?.descuento || 0;
  const descOS    = osSel&&programaSel ? Math.round(subtotal*pctDesc/100) : 0;
  const coseguro  = osSel&&programaSel ? (parseFloat(coseguroEdit)||0) : 0;
  const total     = subtotal - descOS;
  // Si pasó por validación de receta, el monto a cobrar viene de la validación; el coseguro se suma sobre ese monto
  const montoValidacion = recetaValidada != null ? recetaValidada.total : total;
  const totalACobrar   = montoValidacion + coseguro;

  const medio      = MEDIOS_PAGO.find(m=>m.id===medioActivo);
  const recargoPct = medio&&cuotas>1?(RECARGOS[medio.id]?.[cuotas]||0):0;
  const montoNum   = parseFloat(monto)||0;
  const montoFinal = Math.round(montoNum*(1+recargoPct/100));
  const totalPagado= pagos.reduce((a,p)=>a+p.montoBase,0);
  const pendiente  = Math.max(0,totalACobrar-totalPagado);
  const completo   = totalPagado>=totalACobrar&&pagos.length>0;
  const vuelto     = Math.max(0,totalPagado-totalACobrar);

  const agregarPago = () => {
    if(!medioActivo||montoNum<=0) return;
    setPagos([...pagos,{id:Date.now(),medio:medioActivo,label:medio.label,icon:medio.icon,color:medio.color,montoBase:montoNum,montoFinal,cuotas,recargoPct}]);
    setMedio(null); setMonto(""); setCuotas(1);
  };
  const resetVenta = () => { setItems([]); setVendedor(""); setCliente(""); setOSInput("Venta al público"); setOSSel(VENTA_PUBLICO); setPrograma(null); setCoseguro(0); setPagos([]); setMedio(null); setRecetaValidada(null); setStep("venta"); setNroFactura(n=>n+1); refVendedor.current?.focus(); };

  if(step==="ok") return (
    <div style={{textAlign:"center",padding:60}}>
      <div style={{fontSize:64,marginBottom:16}}>✅</div>
      <h2 style={{color:"#10b981",fontSize:24,marginBottom:8}}>¡Cobro registrado! {`F-${String(nroFactura).padStart(4,"0")}`}</h2>
      <p style={{color:"#64748b",marginBottom:8}}>{pagos.map(p=>`${p.icon} ${p.label}${p.cuotas>1?` (${p.cuotas} cuotas)`:""}: ${fmt(p.montoFinal)}`).join("  ·  ")}</p>
      {vuelto>0&&<p style={{color:"#10b981",fontWeight:700,fontSize:18}}>💵 Vuelto: {fmt(vuelto)}</p>}
      <button onClick={resetVenta} style={{marginTop:16,background:"#0ea5e9",color:"#fff",border:"none",borderRadius:10,padding:"12px 32px",fontWeight:700,cursor:"pointer",fontSize:15}}>Nueva Venta</button>
    </div>
  );

  if(step==="receta") return (
    <ValidacionReceta osSel={osSel} items={items} subtotal={subtotal} descOS={descOS} total={total}
      onVolver={()=>setStep("venta")} onAceptada={datos=>{ setRecetaValidada(datos); setStep("cobro"); }}/>
  );

  if(step==="cobro") return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:20}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <button onClick={()=>setStep("venta")} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontWeight:700,color:"#64748b",fontSize:13}}>← Volver</button>
          <h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#1e293b"}}>Cobro — {`F-${String(nroFactura).padStart(4,"0")}`}</h2>
          {recetaValidada&&<span style={{background:"#d1fae5",color:"#065f46",borderRadius:8,padding:"4px 12px",fontSize:12,fontWeight:700}}>✓ Receta {recetaValidada.codigo}</span>}
        </div>
        <div style={{fontSize:12,color:"#64748b",fontWeight:700,textTransform:"uppercase",marginBottom:10}}>Seleccionar medio de pago</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:20}}>
          {MEDIOS_PAGO.map(m=>{
            const ya=pagos.find(p=>p.medio===m.id); const act=medioActivo===m.id;
            return <button key={m.id} onClick={()=>setMedio(act?null:m.id)} style={{padding:"10px 6px",borderRadius:10,border:`2px solid ${act?m.color:ya?m.color+"55":"#e2e8f0"}`,background:act?m.color+"20":ya?m.color+"08":"#fff",color:act?m.color:ya?m.color:"#64748b",cursor:"pointer",fontWeight:700,fontSize:10,position:"relative",textAlign:"center"}}>
              <div style={{fontSize:18,marginBottom:3}}>{m.icon}</div>{m.label}
              {ya&&<div style={{position:"absolute",top:4,right:4,width:7,height:7,borderRadius:"50%",background:m.color}}/>}
            </button>;
          })}
        </div>
        {medioActivo&&(
          <div style={{background:"#f8fafc",borderRadius:14,padding:18,border:`2px solid ${medio.color}44`,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <span style={{fontSize:22}}>{medio.icon}</span>
              <span style={{fontWeight:800,color:medio.color,fontSize:15}}>{medio.label}</span>
              {pendiente>0&&<button onClick={()=>setMonto(String(Math.round(pendiente)))} style={{marginLeft:"auto",background:medio.color+"15",color:medio.color,border:`1px solid ${medio.color}33`,borderRadius:7,padding:"3px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>Usar pendiente {fmt(pendiente)}</button>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:medio.cuotas?"1fr 1fr":"1fr",gap:12}}>
              <div>
                <label style={{fontSize:11,color:"#64748b",fontWeight:700,display:"block",marginBottom:5}}>MONTO</label>
                <input type="number" value={monto} onChange={e=>setMonto(e.target.value)} placeholder="0" onKeyDown={e=>e.key==="Enter"&&agregarPago()}
                  style={{width:"100%",padding:"10px 14px",borderRadius:9,border:`2px solid ${medio.color}44`,fontSize:16,fontWeight:700,outline:"none",boxSizing:"border-box"}}/>
              </div>
              {medio.cuotas&&<div>
                <label style={{fontSize:11,color:"#64748b",fontWeight:700,display:"block",marginBottom:5}}>CUOTAS</label>
                <select value={cuotas} onChange={e=>setCuotas(parseInt(e.target.value))} style={{width:"100%",padding:"11px 12px",borderRadius:9,border:`2px solid ${medio.color}44`,fontSize:13,fontWeight:700,outline:"none"}}>
                  {[1,3,6,12].map(c=>{const r=RECARGOS[medio.id]?.[c];return <option key={c} value={c}>{c===1?"1 cuota":`${c} cuotas${r?` (+${r}%)`:""}`}</option>;})}
                </select>
              </div>}
            </div>
            {recargoPct>0&&montoNum>0&&<div style={{marginTop:10,padding:"8px 12px",background:"#7c3aed15",borderRadius:8,fontSize:12,color:"#7c3aed",fontWeight:700}}>Recargo {cuotas} cuotas (+{recargoPct}%): {fmt(montoNum)} → {fmt(montoFinal)}</div>}
            <button onClick={agregarPago} disabled={montoNum<=0} style={{width:"100%",marginTop:12,padding:"11px",background:montoNum>0?medio.color:"#e2e8f0",color:montoNum>0?"#fff":"#94a3b8",border:"none",borderRadius:10,fontWeight:800,fontSize:14,cursor:montoNum>0?"pointer":"not-allowed"}}>
              + Agregar {medio.label}
            </button>
          </div>
        )}
        {pagos.map(p=>(
          <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff",borderRadius:12,padding:"12px 16px",border:`1px solid ${p.color}33`,marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:9,background:p.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{p.icon}</div>
              <div>
                <div style={{fontWeight:700,fontSize:13}}>{p.label}{p.cuotas>1&&` · ${p.cuotas} cuotas`}</div>
                {p.recargoPct>0&&<div style={{fontSize:11,color:"#94a3b8"}}>Base {fmt(p.montoBase)} +{p.recargoPct}%</div>}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontWeight:800,fontSize:15,color:p.color}}>{fmt(p.montoFinal)}</span>
              <button onClick={()=>setPagos(pagos.filter(x=>x.id!==p.id))} style={{background:"#fee2e2",color:"#ef4444",border:"none",borderRadius:7,padding:"5px 7px",cursor:"pointer"}}><Icon name="x" size={13}/></button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div style={{background:"#fff",borderRadius:16,padding:20,border:"1px solid #e2e8f0",position:"sticky",top:20}}>
          <h4 style={{margin:"0 0 14px",fontWeight:700,color:"#1e293b"}}>Resumen</h4>
          <div style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f1f5f9",fontSize:13}}>
              <span style={{color:"#64748b"}}>Subtotal</span><span style={{fontWeight:600}}>{fmt(subtotal)}</span>
            </div>
            {osSel&&programaSel&&<>
              <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f1f5f9",fontSize:12}}>
                <span style={{color:"#7c3aed",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{osSel.nombre} · {programaSel.nombre}</span>
                <span style={{fontWeight:700,color:"#7c3aed",flexShrink:0}}>−{fmt(descOS)}</span>
              </div>
              {coseguro>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f1f5f9",fontSize:12}}>
                <span style={{color:"#15803d"}}>Coseguro</span>
                <span style={{fontWeight:600,color:"#15803d"}}>{fmt(coseguro)}</span>
              </div>}
            </>}
          </div>
          {recetaValidada&&(
            <div style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f1f5f9",fontSize:12}}>
                <span style={{color:"#7c3aed"}}>Monto validación (receta)</span><span style={{fontWeight:600,color:"#7c3aed"}}>{fmt(montoValidacion)}</span>
              </div>
              {coseguro>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f1f5f9",fontSize:12}}>
                <span style={{color:"#15803d"}}>Coseguro</span><span style={{fontWeight:600,color:"#15803d"}}>{fmt(coseguro)}</span>
              </div>}
            </div>
          )}
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderTop:"3px solid #0ea5e9"}}>
            <span style={{fontWeight:800,fontSize:16}}>TOTAL A COBRAR</span>
            <span style={{fontWeight:800,fontSize:20,color:"#0ea5e9"}}>{fmt(totalACobrar)}</span>
          </div>
          <div style={{height:6,background:"#f1f5f9",borderRadius:4,overflow:"hidden",marginBottom:8}}>
            <div style={{height:"100%",borderRadius:4,width:`${Math.min(100,(totalPagado/(totalACobrar||1))*100)}%`,background:completo?"#10b981":"#0ea5e9",transition:"width .3s"}}/>
          </div>
          {pendiente>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"10px 12px",background:"#fef3c7",borderRadius:9,marginBottom:10}}>
            <span style={{color:"#92400e",fontWeight:700,fontSize:13}}>⚠ Pendiente</span><span style={{fontWeight:800,color:"#92400e"}}>{fmt(pendiente)}</span>
          </div>}
          {completo&&vuelto>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"10px 12px",background:"#d1fae5",borderRadius:9,marginBottom:10}}>
            <span style={{color:"#065f46",fontWeight:700}}>💵 Vuelto</span><span style={{fontWeight:800,color:"#065f46",fontSize:16}}>{fmt(vuelto)}</span>
          </div>}
          <button onClick={()=>completo&&setStep("ok")} disabled={!completo} style={{width:"100%",padding:"14px",background:completo?"#10b981":"#e2e8f0",color:completo?"#fff":"#94a3b8",border:"none",borderRadius:12,fontWeight:800,fontSize:15,cursor:completo?"pointer":"not-allowed",transition:"all .2s",boxShadow:completo?"0 4px 16px #10b98140":"none"}}>
            {completo?`✓ Confirmar ${fmt(totalACobrar)}`:`Faltan ${fmt(pendiente)}`}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20}}>
      <div>
        <h2 style={{margin:"0 0 12px",fontSize:20,fontWeight:800,color:"#1e293b"}}>Nueva Venta</h2>

        {/* Header: Vendedor / Cliente / Obra social / Plan */}
        <div style={{background:"#fff",borderRadius:12,padding:"10px 14px",border:"1px solid #e2e8f0",marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>

            {/* Columna izquierda: Vendedor / Cliente */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,whiteSpace:"nowrap"}}>Vendedor</span>
                <div style={{position:"relative",flex:1,minWidth:100}}>
                  <input ref={refVendedor} value={vendedor} onChange={e=>{setVendedor(e.target.value);setShowVendedores(true);setHighlightVendedor(0);}}
                    onFocus={()=>{setShowVendedores(true);setHighlightVendedor(0);}} onBlur={()=>setTimeout(()=>setShowVendedores(false),150)}
                    onKeyDown={e=>{
                      if(showVendedores&&vendedoresFilt.length>0){
                        if(e.key==="ArrowDown"){e.preventDefault();setHighlightVendedor(i=>Math.min(i+1,vendedoresFilt.length-1));return;}
                        if(e.key==="ArrowUp"){e.preventDefault();setHighlightVendedor(i=>Math.max(i-1,0));return;}
                        if(e.key==="Enter"){e.preventDefault();selVendedor(vendedoresFilt[Math.min(highlightVendedor,vendedoresFilt.length-1)]);return;}
                      }
                      if(e.key==="Enter"){e.preventDefault();refCliente.current?.focus();}
                    }}
                    placeholder="Mostrador"
                    style={{width:"100%",padding:"6px 10px",borderRadius:6,border:"1px solid #e2e8f0",fontSize:12,outline:"none",boxSizing:"border-box"}}/>
                  {showVendedores&&vendedoresFilt.length>0&&(
                    <div style={{position:"absolute",left:0,right:0,top:"100%",marginTop:2,background:"#fff",borderRadius:8,boxShadow:"0 12px 28px #0002",border:"1px solid #e2e8f0",zIndex:40,maxHeight:160,overflowY:"auto"}}>
                      {vendedoresFilt.map((v,i)=>(
                        <div key={v.id} ref={i===highlightVendedor?refHighlightVendedor:undefined} onClick={()=>selVendedor(v)} onMouseEnter={()=>setHighlightVendedor(i)}
                          style={{padding:"8px 10px",cursor:"pointer",fontSize:12,borderBottom:"1px solid #f8fafc",background:i===highlightVendedor?"#f0f9ff":"#fff"}}>{v.nombre}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,whiteSpace:"nowrap"}}>Cliente</span>
                <div style={{position:"relative",flex:1,minWidth:100}}>
                  <input ref={refCliente} value={cliente} onChange={e=>{setCliente(e.target.value);setShowClientes(true);setHighlightCliente(0);}}
                    onFocus={()=>{setShowClientes(true);setHighlightCliente(0);}} onBlur={()=>setTimeout(()=>setShowClientes(false),150)}
                    onKeyDown={e=>{
                      if(showClientes&&clientesFilt.length>0){
                        if(e.key==="ArrowDown"){e.preventDefault();setHighlightCliente(i=>Math.min(i+1,clientesFilt.length-1));return;}
                        if(e.key==="ArrowUp"){e.preventDefault();setHighlightCliente(i=>Math.max(i-1,0));return;}
                        if(e.key==="Enter"){e.preventDefault();selCliente(clientesFilt[Math.min(highlightCliente,clientesFilt.length-1)]);return;}
                      }
                      if(e.key==="Enter"){e.preventDefault();refOS.current?.focus();}
                    }}
                    placeholder="Mostrador"
                    style={{width:"100%",padding:"6px 10px",borderRadius:6,border:"1px solid #e2e8f0",fontSize:12,outline:"none",boxSizing:"border-box"}}/>
                  {showClientes&&clientesFilt.length>0&&(
                    <div style={{position:"absolute",left:0,right:0,top:"100%",marginTop:2,background:"#fff",borderRadius:8,boxShadow:"0 12px 28px #0002",border:"1px solid #e2e8f0",zIndex:40,maxHeight:160,overflowY:"auto"}}>
                      {clientesFilt.map((c,i)=>(
                        <div key={c.id} ref={i===highlightCliente?refHighlightCliente:undefined} onClick={()=>selCliente(c)} onMouseEnter={()=>setHighlightCliente(i)}
                          style={{padding:"8px 10px",cursor:"pointer",fontSize:12,borderBottom:"1px solid #f8fafc",background:i===highlightCliente?"#f0f9ff":"#fff"}}>
                          {c.nombre} {c.dni&&<span style={{color:"#94a3b8",fontSize:10}}>({c.dni})</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha: Obra social / Plan */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,whiteSpace:"nowrap"}}>Obra social</span>
                <div style={{position:"relative",flex:1,minWidth:100}}>
                  <input ref={refOS} value={osInput} onChange={e=>{setOSInput(e.target.value);setShowOS(true);setHighlightOS(0);setOSListaCompleta(false);}}
                    onFocus={()=>{setShowOS(true);setHighlightOS(0);setOSListaCompleta(true);}} onBlur={()=>setTimeout(()=>setShowOS(false),150)}
                    onKeyDown={e=>{
                      const listaMostrar=osListaCompleta?listaOS:osFilt;
                      if(showOS&&listaMostrar.length>0){
                        if(e.key==="ArrowDown"){e.preventDefault();setHighlightOS(i=>Math.min(i+1,listaMostrar.length-1));return;}
                        if(e.key==="ArrowUp"){e.preventDefault();setHighlightOS(i=>Math.max(i-1,0));return;}
                        if(e.key==="Enter"){e.preventDefault();selOSItem(listaMostrar[Math.min(highlightOS,listaMostrar.length-1)]);return;}
                      }
                      if(e.key==="Enter"){e.preventDefault();refBuscar.current?.focus();}
                    }}
                    placeholder="Venta al público"
                    style={{width:"100%",padding:"6px 10px",borderRadius:6,border:"1px solid #e2e8f0",fontSize:12,outline:"none",boxSizing:"border-box"}}/>
                  {showOS&&(osListaCompleta?listaOS:osFilt).length>0&&(
                    <div style={{position:"absolute",left:0,right:0,top:"100%",marginTop:2,background:"#fff",borderRadius:8,boxShadow:"0 12px 28px #0002",border:"1px solid #e2e8f0",zIndex:40,maxHeight:160,overflowY:"auto"}}>
                      {(osListaCompleta?listaOS:osFilt).map((o,i)=>(
                        <div key={o.id} ref={i===highlightOS?refHighlightOS:undefined} onClick={()=>selOSItem(o)} onMouseEnter={()=>setHighlightOS(i)}
                          style={{padding:"8px 10px",cursor:"pointer",fontSize:12,borderBottom:"1px solid #f8fafc",background:i===highlightOS?"#f0f9ff":"#fff"}}>
                          {o.nombre} {o.codigo&&<span style={{color:"#94a3b8",fontSize:10}}>({o.codigo})</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:10,color:"#94a3b8",fontWeight:700,whiteSpace:"nowrap"}}>Plan / Programa</span>
                <div style={{flex:1,minWidth:100}}>
                  <select
                    value={programaSel?.id || ""}
                    onChange={e=>{
                      const id = e.target.value ? parseInt(e.target.value,10) : null;
                      const prog = id && osSel?.programas ? osSel.programas.find(p=>p.id===id) : null;
                      selProg(prog || null);
                    }}
                    disabled={!osSel || !osSel.programas?.length || osSel===VENTA_PUBLICO}
                    style={{width:"100%",padding:"6px 10px",borderRadius:6,border:"1px solid #e2e8f0",fontSize:12,outline:"none",boxSizing:"border-box",background:(!osSel || !osSel.programas?.length || osSel===VENTA_PUBLICO)?"#f9fafb":"#fff",color:"#0f172a"}}
                  >
                    <option value="">{!osSel || osSel===VENTA_PUBLICO ? "Sin plan (venta al público)" : "Seleccionar plan..."}</option>
                    {osSel?.programas?.map(p=>(
                      <option key={p.id} value={p.id}>{p.nombre} {p.descuento}%</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Especificaciones obra social / plan */}
          {osSel&&programaSel&&(
            <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginTop:12,paddingTop:12,borderTop:"1px solid #f1f5f9",fontSize:11}}>
              <div style={{color:"#7c3aed",fontWeight:700}}>
                {osSel.nombre} · {programaSel.nombre} — {programaSel.descuento}% cobertura
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:"#7c3aed",fontWeight:700}}>Descuento aprox: {fmt(descOS)}</span>
                <input
                  type="number"
                  value={coseguroEdit}
                  onChange={e=>setCoseguro(e.target.value)}
                  placeholder="Coseguro"
                  style={{width:80,padding:"4px 6px",borderRadius:6,border:"1px solid #bbf7d0",fontSize:11,outline:"none",boxSizing:"border-box"}}
                />
              </div>
            </div>
          )}
        </div>

        {/* Buscador productos — prominente */}
        <div style={{background:"#fff",borderRadius:14,padding:16,border:"2px solid #0ea5e9",marginBottom:12,boxShadow:"0 2px 12px #0ea5e920"}}>
          <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
            {CRITERIOS.map(c=>(
              <button key={c.id} onClick={()=>{ setCriterioBuscar(c.id); setBuscar(""); refBuscar.current?.focus(); }}
                style={{padding:"6px 12px",borderRadius:8,border:"none",fontSize:12,fontWeight:700,cursor:"pointer",
                  background:criterioBuscar===c.id?"#0ea5e9":"#f1f5f9",color:criterioBuscar===c.id?"#fff":"#64748b"}}>
                {c.label}
              </button>
            ))}
          </div>
          <div style={{position:"relative"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:10,border:`2px solid ${buscar?"#0ea5e9":"#e2e8f0"}`,background:buscar?"#fff":"#f0f9ff"}}>
              <span style={{fontSize:18,color:"#0ea5e9"}}>🔍</span>
              <input ref={refBuscar} value={buscar} onChange={e=>{setBuscar(e.target.value);setHighlightProd(0);}}
                onKeyDown={e=>{
                  if(prodsFilt.length>0){
                    if(e.key==="ArrowDown"){e.preventDefault();setHighlightProd(i=>Math.min(i+1,prodsFilt.length-1));return;}
                    if(e.key==="ArrowUp"){e.preventDefault();setHighlightProd(i=>Math.max(i-1,0));return;}
                    if(e.key==="Enter"){e.preventDefault();const p=prodsFilt[Math.min(highlightProd,prodsFilt.length-1)];if(p&&p.stock>0)addItem(p);return;}
                  }
                }}
                placeholder={CRITERIOS.find(c=>c.id===criterioBuscar)?.ph}
                style={{border:"none",outline:"none",fontSize:16,flex:1,background:"transparent",color:"#1e293b",fontWeight:500}}/>
              {buscar&&<button onClick={()=>setBuscar("")} style={{background:"#e2e8f0",border:"none",borderRadius:6,color:"#64748b",cursor:"pointer",fontSize:14,padding:"4px 10px",fontWeight:700}}>✕</button>}
            </div>
            {prodsFilt.length>0&&(
              <div style={{position:"absolute",left:0,right:0,top:"calc(100% + 6px)",background:"#fff",borderRadius:12,boxShadow:"0 12px 40px #0003",border:"1px solid #e2e8f0",zIndex:25,maxHeight:280,overflowY:"auto"}}>
                <div style={{padding:"8px 14px",background:"#0ea5e9",color:"#fff",fontSize:12,fontWeight:700}}>
                  {prodsFilt.length} resultado{prodsFilt.length!==1?"s":""} — {CRITERIOS.find(c=>c.id===criterioBuscar)?.label}
                </div>
                {prodsFilt.map((p,i)=>{
                  const det=criterioBuscar==="troquel"?`Troquel: ${p.troquel}`:criterioBuscar==="barras"?`Barras: ${p.codigoBarras}`:criterioBuscar==="droga"?`Droga: ${p.droga}`:criterioBuscar==="accion"?p.accionTerapeutica:`${p.codigoAlfabeta} · Troquel: ${p.troquel}`;
                  const noStock=p.stock<=0;
                  return (
                    <div key={p.id} ref={i===highlightProd?refHighlightProd:undefined} onClick={()=>!noStock&&addItem(p)} onMouseEnter={()=>setHighlightProd(i)}
                      style={{padding:"12px 14px",cursor:noStock?"not-allowed":"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16,opacity:noStock?.5:1,background:i===highlightProd?"#f0f9ff":"transparent",borderBottom:"1px solid #f8fafc"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                          <span style={{fontWeight:700,fontSize:14,color:"#1e293b"}}>{p.nombre}</span>
                          <span style={{fontSize:10,background:"#e0f2fe",color:"#0284c7",borderRadius:4,padding:"2px 6px",fontWeight:700}}>{p.categoria}</span>
                        </div>
                        <div style={{fontSize:12,color:"#94a3b8"}}>{p.laboratorio} · <span style={{color:"#64748b"}}>{det}</span></div>
                      </div>
                      {p.descripcionLarga&&(
                        <div style={{flex:"0 1 280px",fontSize:11,color:"#64748b",lineHeight:1.4,maxHeight:48,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
                          {p.descripcionLarga}
                        </div>
                      )}
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontWeight:800,fontSize:15,color:"#0ea5e9"}}>{fmt(p.precio)}</div>
                        <div style={{fontSize:11,color:p.stock<=p.stockMin?"#f59e0b":"#10b981",fontWeight:600}}>Stock: {p.stock}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Carrito — siempre visible cuando hay ítems */}
        {items.length>0&&(
          <div style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #e2e8f0"}}>
            <h4 style={{margin:"0 0 10px",fontSize:13,fontWeight:700,color:"#1e293b"}}>Carrito ({items.length} {items.length===1?"producto":"productos"})</h4>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{borderBottom:"2px solid #f1f5f9"}}>{["Producto","Cant.","P.Unit.","OS","Paciente",""].map(h=><th key={h} style={{textAlign:"left",padding:"8px 10px",color:"#64748b",fontSize:11,fontWeight:700}}>{h}</th>)}</tr></thead>
              <tbody>{items.map(i=>{
                const dOS=programaSel?Math.round(i.precio*i.cantidad*pctDesc/100):0;
                return(<tr key={i.id} style={{borderBottom:"1px solid #f8fafc"}}>
                  <td style={{padding:"10px"}}><div style={{fontWeight:600,fontSize:13}}>{i.nombre}</div></td>
                  <td style={{padding:"10px"}}><input type="number" value={i.cantidad} min={1} onChange={e=>setItems(items.map(x=>x.id===i.id?{...x,cantidad:parseInt(e.target.value)||1}:x))} style={{width:50,padding:"6px 8px",borderRadius:6,border:"1px solid #e2e8f0",textAlign:"center",fontSize:13}}/></td>
                  <td style={{padding:"10px",color:"#64748b"}}>{fmt(i.precio)}</td>
                  <td style={{padding:"10px",color:dOS?"#7c3aed":"#94a3b8",fontWeight:600}}>{dOS?`−${fmt(dOS)}`:"—"}</td>
                  <td style={{padding:"10px",fontWeight:700,color:"#0ea5e9"}}>{fmt(i.precio*i.cantidad-dOS)}</td>
                  <td style={{padding:"10px"}}><button onClick={()=>removeItem(i.id)} style={{background:"#fee2e2",color:"#ef4444",border:"none",borderRadius:6,padding:"6px 10px",cursor:"pointer",fontWeight:700}}><Icon name="x" size={14}/></button></td>
                </tr>);
              })}</tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumen */}
      <div>
        <div style={{background:"#fff",borderRadius:16,padding:20,border:"1px solid #e2e8f0",position:"sticky",top:20}}>
          <h4 style={{margin:"0 0 14px",fontWeight:700,color:"#1e293b"}}>Resumen</h4>
          <div style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f1f5f9",fontSize:13}}>
              <span style={{color:"#64748b"}}>Subtotal</span><span style={{fontWeight:600}}>{fmt(subtotal)}</span>
            </div>
            {osSel&&programaSel&&<>
              <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f1f5f9",fontSize:12}}>
                <span style={{color:"#7c3aed",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{osSel.nombre} · {programaSel.nombre}</span>
                <span style={{fontWeight:700,color:"#7c3aed",flexShrink:0}}>−{fmt(descOS)}</span>
              </div>
              {coseguro>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f1f5f9",fontSize:12}}>
                <span style={{color:"#15803d"}}>Coseguro</span><span style={{fontWeight:600,color:"#15803d"}}>{fmt(coseguro)}</span>
              </div>}
            </>}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderTop:"3px solid #0ea5e9"}}>
            <span style={{fontWeight:800,fontSize:16}}>TOTAL</span>
            <span style={{fontWeight:800,fontSize:20,color:"#0ea5e9"}}>{fmt(total)}</span>
          </div>
          <button
            onClick={()=>{ if(!items.length) return; if(osSel&&programaSel&&programaSel.requiereReceta) setStep("receta"); else setStep("cobro"); }}
            disabled={items.length===0}
            style={{width:"100%",padding:"13px",background:items.length>0?"#0ea5e9":"#e2e8f0",color:items.length>0?"#fff":"#94a3b8",border:"none",borderRadius:12,fontWeight:800,fontSize:14,cursor:items.length>0?"pointer":"not-allowed",marginBottom:osSel&&programaSel?10:0}}>
            {osSel&&programaSel&&programaSel.requiereReceta?"🏥 Validar Receta":"💳 Ir a cobrar"} {items.length>0?fmt(total):""}
          </button>
          {osSel&&programaSel&&<div style={{padding:"10px 12px",background:"#ede9fe",borderRadius:9,fontSize:11}}>
            <div style={{fontWeight:700,color:"#7c3aed",marginBottom:3}}>🏥 {osSel.nombre} · {programaSel.nombre}</div>
            <div style={{color:"#6d28d9"}}>OS cubre {fmt(descOS)} ({pctDesc}%) · Paciente: {fmt(total)}</div>
            {programaSel.requiereReceta&&<div style={{color:"#7c3aed",marginTop:4,fontSize:10}}>⚠ Requiere validación de receta</div>}
          </div>}
        </div>
      </div>
    </div>
  );
}

// ── ABM OBRAS SOCIALES ────────────────────────────────────────────────────────
const OS_FORM_VACIO = { codigo:"", nombre:"", mandataria:"", telefono:"", activa:true };
const PROG_FORM_VACIO = { nombre:"", descuento:"", coseguro:"0", tope:"", requiereReceta:true };

function ABMObrasSociales({ obrasSociales, setObrasSociales }) {
  const [vista, setVista]           = useState("lista"); // lista | os_form | prog_form
  const [osModal, setOsModal]       = useState(null);    // null | {modo, os?}
  const [progModal, setProgModal]   = useState(null);    // null | {modo, os, prog?}
  const [osForm, setOsForm]         = useState(OS_FORM_VACIO);
  const [progForm, setProgForm]     = useState(PROG_FORM_VACIO);
  const [osErrs, setOsErrs]         = useState({});
  const [progErrs, setProgErrs]     = useState({});
  const [osDesplegada, setDesp]     = useState(null);    // id OS con programas visibles
  const [confirmarBaja, setConfBaja]= useState(null);    // {tipo:"os"|"prog", os, prog?}

  /* ── helpers OS ── */
  const abrirNuevaOS = () => { setOsForm(OS_FORM_VACIO); setOsErrs({}); setOsModal({modo:"nuevo"}); };
  const abrirEditOS  = os  => { setOsForm({codigo:os.codigo,nombre:os.nombre,mandataria:os.mandataria,telefono:os.telefono,activa:os.activa}); setOsErrs({}); setOsModal({modo:"editar",os}); };
  const validarOS    = f   => {
    const e={};
    if(!f.codigo.trim()) e.codigo="Requerido";
    if(!f.nombre.trim()) e.nombre="Requerido";
    if(!f.mandataria.trim()) e.mandataria="Requerido";
    const dup=obrasSociales.find(o=>o.codigo.toLowerCase()===f.codigo.trim().toLowerCase()&&(osModal?.modo==="nuevo"||o.id!==osModal?.os?.id));
    if(dup) e.codigo="Código ya existe";
    setOsErrs(e); return Object.keys(e).length===0;
  };
  const guardarOS = () => {
    if(!validarOS(osForm)) return;
    const data={codigo:osForm.codigo.trim().toUpperCase(),nombre:osForm.nombre.trim(),mandataria:osForm.mandataria.trim(),telefono:osForm.telefono.trim(),activa:osForm.activa};
    if(osModal.modo==="nuevo") setObrasSociales(p=>[...p,{id:Date.now(),...data,programas:[]}]);
    else setObrasSociales(p=>p.map(o=>o.id===osModal.os.id?{...o,...data}:o));
    setOsModal(null);
  };
  const toggleActiva = os => setObrasSociales(p=>p.map(o=>o.id===os.id?{...o,activa:!o.activa}:o));
  const eliminarOS   = os => { setObrasSociales(p=>p.filter(o=>o.id!==os.id)); setConfBaja(null); };

  /* ── helpers Programas ── */
  const abrirNuevoProg = os   => { setProgForm(PROG_FORM_VACIO); setProgErrs({}); setProgModal({modo:"nuevo",os}); };
  const abrirEditProg  = (os,p)=> { setProgForm({nombre:p.nombre,descuento:String(p.descuento),coseguro:String(p.coseguro),tope:p.tope?String(p.tope):"",requiereReceta:p.requiereReceta}); setProgErrs({}); setProgModal({modo:"editar",os,prog:p}); };
  const validarProg    = f    => {
    const e={};
    if(!f.nombre.trim()) e.nombre="Requerido";
    if(!f.descuento||isNaN(f.descuento)||+f.descuento<0||+f.descuento>100) e.descuento="0-100";
    if(isNaN(f.coseguro)||+f.coseguro<0) e.coseguro="≥ 0";
    if(f.tope&&isNaN(f.tope)) e.tope="Número o vacío";
    setProgErrs(e); return Object.keys(e).length===0;
  };
  const guardarProg = () => {
    if(!validarProg(progForm)) return;
    const data={nombre:progForm.nombre.trim(),descuento:+progForm.descuento,coseguro:+progForm.coseguro,tope:progForm.tope?+progForm.tope:null,requiereReceta:progForm.requiereReceta};
    setObrasSociales(p=>p.map(o=>{
      if(o.id!==progModal.os.id) return o;
      const progs = progModal.modo==="nuevo"
        ? [...o.programas,{id:Date.now(),...data}]
        : o.programas.map(pg=>pg.id===progModal.prog.id?{...pg,...data}:pg);
      return {...o,programas:progs};
    }));
    setProgModal(null);
  };
  const eliminarProg = (os,prog) => {
    setObrasSociales(p=>p.map(o=>o.id===os.id?{...o,programas:o.programas.filter(pg=>pg.id!==prog.id)}:o));
    setConfBaja(null);
  };

  /* ── campo helper ── */
  const fld=(form,setForm,errs,key,label,type="text",opts={})=>{
    const err=errs[key];
    return(
      <div>
        <label style={{fontSize:11,color:err?"#ef4444":"#64748b",fontWeight:700,display:"block",marginBottom:4}}>
          {label}{opts.req!==false&&<span style={{color:"#ef4444"}}> *</span>}
          {err&&<span style={{marginLeft:6,fontSize:10,color:"#ef4444"}}>{err}</span>}
        </label>
        <input type={type} value={form[key]} placeholder={opts.ph||""}
          onChange={e=>setForm({...form,[key]:type==="checkbox"?e.target.checked:e.target.value})}
          style={{width:"100%",padding:"9px 11px",borderRadius:9,border:`1.5px solid ${err?"#ef4444":"#e2e8f0"}`,fontSize:13,outline:"none",boxSizing:"border-box",background:err?"#fff5f5":"#fff"}}/>
      </div>
    );
  };

  return (
    <div>
      {/* Modal confirmación baja */}
      {confirmarBaja&&(
        <Overlay onClose={()=>setConfBaja(null)} zIndex={300}>
          <div style={{background:"#fff",borderRadius:16,padding:28,maxWidth:380,width:"90%",boxShadow:"0 24px 60px #0008"}}>
            <div style={{fontSize:28,textAlign:"center",marginBottom:12}}>⚠️</div>
            <div style={{fontWeight:800,fontSize:16,color:"#1e293b",textAlign:"center",marginBottom:8}}>
              {confirmarBaja.tipo==="os"?"Eliminar Obra Social":"Eliminar Programa"}
            </div>
            <div style={{fontSize:13,color:"#64748b",textAlign:"center",marginBottom:20}}>
              {confirmarBaja.tipo==="os"
                ?`¿Eliminar "${confirmarBaja.os.nombre}" y todos sus programas?`
                :`¿Eliminar el programa "${confirmarBaja.prog.nombre}" de ${confirmarBaja.os.nombre}?`}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setConfBaja(null)} style={{flex:1,padding:"11px",background:"#f1f5f9",border:"none",borderRadius:10,fontWeight:700,cursor:"pointer",color:"#64748b"}}>Cancelar</button>
              <button onClick={()=>confirmarBaja.tipo==="os"?eliminarOS(confirmarBaja.os):eliminarProg(confirmarBaja.os,confirmarBaja.prog)}
                style={{flex:1,padding:"11px",background:"#ef4444",color:"#fff",border:"none",borderRadius:10,fontWeight:800,cursor:"pointer"}}>Eliminar</button>
            </div>
          </div>
        </Overlay>
      )}

      {/* Modal OS */}
      {osModal&&(
        <Overlay onClose={()=>setOsModal(null)} zIndex={200}>
          <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:480,boxShadow:"0 32px 80px #0008"}}>
            <div style={{padding:"18px 22px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontWeight:800,fontSize:16,color:"#0f172a"}}>{osModal.modo==="nuevo"?"➕ Nueva Obra Social":"✏️ Editar OS — "+osModal.os.nombre}</div>
              <button onClick={()=>setOsModal(null)} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"6px 13px",cursor:"pointer",fontWeight:700,color:"#64748b"}}>✕</button>
            </div>
            <div style={{padding:22,display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {fld(osForm,setOsForm,osErrs,"codigo","Código (sigla)",   "text",{ph:"ej: OSDE"})}
                {fld(osForm,setOsForm,osErrs,"nombre","Nombre completo",  "text",{ph:"ej: OSDE S.A."})}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {fld(osForm,setOsForm,osErrs,"mandataria","Mandataria","text",{ph:"ej: Medifé"})}
                {fld(osForm,setOsForm,osErrs,"telefono","Teléfono","text",{ph:"0800-888-0000",req:false})}
              </div>
              <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:13,color:"#1e293b",fontWeight:600}}>
                <input type="checkbox" checked={osForm.activa} onChange={e=>setOsForm({...osForm,activa:e.target.checked})} style={{width:16,height:16,cursor:"pointer"}}/>
                Obra social activa (visible en facturación)
              </label>
              <div style={{display:"flex",gap:10,marginTop:6}}>
                <button onClick={guardarOS} style={{flex:2,padding:"13px",background:"#8b5cf6",color:"#fff",border:"none",borderRadius:11,fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:"0 4px 14px #8b5cf640"}}>
                  {osModal.modo==="nuevo"?"✓ Crear Obra Social":"✓ Guardar Cambios"}
                </button>
                <button onClick={()=>setOsModal(null)} style={{flex:1,padding:"13px",background:"#f1f5f9",color:"#64748b",border:"none",borderRadius:11,fontWeight:700,cursor:"pointer"}}>Cancelar</button>
              </div>
            </div>
          </div>
        </Overlay>
      )}

      {/* Modal Programa */}
      {progModal&&(
        <Overlay onClose={()=>setProgModal(null)} zIndex={200}>
          <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:500,boxShadow:"0 32px 80px #0008"}}>
            <div style={{padding:"18px 22px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:800,fontSize:16,color:"#0f172a"}}>{progModal.modo==="nuevo"?"➕ Nuevo Programa":"✏️ Editar Programa"}</div>
                <div style={{fontSize:12,color:"#64748b",marginTop:2}}>🏥 {progModal.os.nombre}</div>
              </div>
              <button onClick={()=>setProgModal(null)} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"6px 13px",cursor:"pointer",fontWeight:700,color:"#64748b"}}>✕</button>
            </div>
            <div style={{padding:22,display:"flex",flexDirection:"column",gap:12}}>
              {fld(progForm,setProgForm,progErrs,"nombre","Nombre del programa/plan","text",{ph:"ej: Plan 310 / Medicamentos crónicos"})}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                {fld(progForm,setProgForm,progErrs,"descuento","Descuento OS (%)","number",{ph:"0-100"})}
                {fld(progForm,setProgForm,progErrs,"coseguro","Coseguro ($)","number",{ph:"0"})}
                {fld(progForm,setProgForm,progErrs,"tope","Tope dispensación ($)","number",{ph:"0 = sin tope",req:false})}
              </div>

              {/* Preview descuento */}
              {progForm.descuento&&!isNaN(progForm.descuento)&&(
                <div style={{background:"#f0fdf4",borderRadius:10,padding:"10px 14px",display:"flex",gap:20,fontSize:13}}>
                  <span>Sobre $10.000: <strong style={{color:"#7c3aed"}}>OS paga {fmt(10000*+progForm.descuento/100)}</strong></span>
                  <span>Paciente: <strong style={{color:"#0284c7"}}>{fmt(10000-10000*+progForm.descuento/100)}</strong></span>
                  {progForm.coseguro>0&&<span>+ Coseguro: <strong style={{color:"#15803d"}}>{fmt(+progForm.coseguro)}</strong></span>}
                </div>
              )}

              <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:13,color:"#1e293b",fontWeight:600}}>
                <input type="checkbox" checked={progForm.requiereReceta} onChange={e=>setProgForm({...progForm,requiereReceta:e.target.checked})} style={{width:16,height:16,cursor:"pointer"}}/>
                Requiere validación de receta
              </label>
              <div style={{display:"flex",gap:10,marginTop:6}}>
                <button onClick={guardarProg} style={{flex:2,padding:"13px",background:"#0ea5e9",color:"#fff",border:"none",borderRadius:11,fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:"0 4px 14px #0ea5e940"}}>
                  {progModal.modo==="nuevo"?"✓ Agregar Programa":"✓ Guardar Programa"}
                </button>
                <button onClick={()=>setProgModal(null)} style={{flex:1,padding:"13px",background:"#f1f5f9",color:"#64748b",border:"none",borderRadius:11,fontWeight:700,cursor:"pointer"}}>Cancelar</button>
              </div>
            </div>
          </div>
        </Overlay>
      )}

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#1e293b"}}>Obras Sociales</h2>
          <div style={{fontSize:12,color:"#64748b",marginTop:3}}>{obrasSociales.filter(o=>o.activa).length} activas · {obrasSociales.reduce((a,o)=>a+o.programas.length,0)} programas totales</div>
        </div>
        <button onClick={abrirNuevaOS} style={{display:"flex",alignItems:"center",gap:8,background:"#8b5cf6",color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",fontWeight:700,cursor:"pointer",fontSize:13,boxShadow:"0 4px 12px #8b5cf630"}}>
          <Icon name="plus" size={15}/>Nueva OS
        </button>
      </div>

      {/* Lista OS + Programas */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {obrasSociales.length===0&&(
          <div style={{background:"#fff",borderRadius:14,padding:40,textAlign:"center",color:"#94a3b8",border:"1px solid #e2e8f0"}}>
            <div style={{fontSize:32,marginBottom:8}}>🏥</div>
            Sin obras sociales registradas. Hacé clic en "Nueva OS" para empezar.
          </div>
        )}
        {obrasSociales.map(os=>(
          <div key={os.id} style={{background:"#fff",borderRadius:14,border:`1.5px solid ${os.activa?"#e2e8f0":"#f1f5f9"}`,overflow:"hidden",opacity:os.activa?1:.7}}>

            {/* Fila OS */}
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px"}}>
              <div style={{width:42,height:42,borderRadius:11,background:os.activa?"#ede9fe":"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15,color:os.activa?"#7c3aed":"#94a3b8",flexShrink:0}}>
                {os.codigo.substring(0,2)}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontWeight:700,fontSize:15,color:"#1e293b"}}>{os.nombre}</span>
                  <span style={{fontSize:10,background:os.activa?"#d1fae5":"#f1f5f9",color:os.activa?"#065f46":"#94a3b8",borderRadius:6,padding:"2px 8px",fontWeight:700}}>{os.activa?"ACTIVA":"INACTIVA"}</span>
                  <span style={{fontSize:11,background:"#e0f2fe",color:"#0284c7",borderRadius:6,padding:"2px 8px",fontWeight:600}}>{os.programas.length} prog.</span>
                </div>
                <div style={{fontSize:12,color:"#64748b",marginTop:2}}>
                  Mandataria: <strong>{os.mandataria}</strong>
                  {os.telefono&&<> · {os.telefono}</>}
                </div>
              </div>

              {/* Acciones OS */}
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                <button onClick={()=>abrirNuevoProg(os)}
                  style={{display:"flex",alignItems:"center",gap:5,background:"#f0f9ff",color:"#0284c7",border:"1px solid #bae6fd",borderRadius:8,padding:"6px 11px",cursor:"pointer",fontSize:11,fontWeight:700}}>
                  <Icon name="plus" size={11}/>Programa
                </button>
                <button onClick={()=>toggleActiva(os)}
                  style={{background:os.activa?"#fef3c7":"#f0fdf4",color:os.activa?"#92400e":"#15803d",border:`1px solid ${os.activa?"#fde68a":"#bbf7d0"}`,borderRadius:8,padding:"6px 11px",cursor:"pointer",fontSize:11,fontWeight:700}}>
                  {os.activa?"Desactivar":"Activar"}
                </button>
                <button onClick={()=>abrirEditOS(os)}
                  style={{background:"#f8fafc",color:"#64748b",border:"1px solid #e2e8f0",borderRadius:8,padding:"6px 10px",cursor:"pointer"}}>
                  <Icon name="edit" size={13}/>
                </button>
                <button onClick={()=>setConfBaja({tipo:"os",os})}
                  style={{background:"#fee2e2",color:"#ef4444",border:"1px solid #fecaca",borderRadius:8,padding:"6px 10px",cursor:"pointer"}}>
                  <Icon name="x" size={13}/>
                </button>
                <button onClick={()=>setDesp(osDesplegada===os.id?null:os.id)}
                  style={{background:"#f8fafc",color:"#64748b",border:"1px solid #e2e8f0",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:11,fontWeight:700}}>
                  {osDesplegada===os.id?"▲ Ocultar":"▼ Programas"}
                </button>
              </div>
            </div>

            {/* Tabla programas */}
            {osDesplegada===os.id&&(
              <div style={{borderTop:"1px solid #f1f5f9",background:"#fafafa"}}>
                {os.programas.length===0?(
                  <div style={{padding:"18px 24px",color:"#94a3b8",fontSize:13,textAlign:"center"}}>Sin programas — hacé clic en "+ Programa" para agregar</div>
                ):(
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead>
                      <tr style={{background:"#f1f5f9"}}>
                        {["Programa / Plan","Descuento OS","Coseguro","Tope","Receta",""].map(h=>(
                          <th key={h} style={{textAlign:"left",padding:"8px 16px",color:"#64748b",fontWeight:700,fontSize:11}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {os.programas.map(prog=>(
                        <tr key={prog.id} style={{borderTop:"1px solid #e2e8f0"}}>
                          <td style={{padding:"10px 16px",fontWeight:600,color:"#1e293b"}}>{prog.nombre}</td>
                          <td style={{padding:"10px 16px"}}>
                            <span style={{background:"#ede9fe",color:"#7c3aed",borderRadius:6,padding:"2px 10px",fontWeight:800,fontSize:13}}>{prog.descuento}%</span>
                          </td>
                          <td style={{padding:"10px 16px",fontWeight:600,color:"#15803d"}}>{prog.coseguro>0?fmt(prog.coseguro):<span style={{color:"#94a3b8"}}>—</span>}</td>
                          <td style={{padding:"10px 16px",color:"#92400e"}}>{prog.tope?fmt(prog.tope):<span style={{color:"#94a3b8"}}>Sin tope</span>}</td>
                          <td style={{padding:"10px 16px"}}>
                            <span style={{fontSize:11,fontWeight:700,color:prog.requiereReceta?"#dc2626":"#16a34a"}}>{prog.requiereReceta?"Obligatoria":"No requiere"}</span>
                          </td>
                          <td style={{padding:"10px 16px"}}>
                            <div style={{display:"flex",gap:6}}>
                              <button onClick={()=>abrirEditProg(os,prog)} style={{background:"#f0f9ff",color:"#0284c7",border:"1px solid #bae6fd",borderRadius:7,padding:"4px 9px",cursor:"pointer",fontSize:11,fontWeight:700}}>Editar</button>
                              <button onClick={()=>setConfBaja({tipo:"prog",os,prog})} style={{background:"#fee2e2",color:"#ef4444",border:"1px solid #fecaca",borderRadius:7,padding:"4px 8px",cursor:"pointer"}}><Icon name="x" size={11}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ABM VADEMÉCUMS ───────────────────────────────────────────────────────────
const VADEMECUM_FORM_VACIO = { nombre: "", descripcion: "", activo: true };

function ABMVademecums({ vademecums, setVademecums, productos, obrasSociales }) {
  const [vadModal, setVadModal]       = useState(null);   // null | { modo: "nuevo"|"editar", vademecum? }
  const [vadForm, setVadForm]         = useState(VADEMECUM_FORM_VACIO);
  const [vadErrs, setVadErrs]         = useState({});
  const [desplegada, setDesplegada]   = useState(null);   // id vademecum expandido
  const [confBaja, setConfBaja]       = useState(null);   // { vademecum }
  const [modalProducto, setModalProducto] = useState(null);   // { vademecum } → agregar producto
  const [prodSel, setProdSel]         = useState(null);   // producto_id para agregar

  const abrirNuevo = () => { setVadForm(VADEMECUM_FORM_VACIO); setVadErrs({}); setVadModal({ modo: "nuevo" }); };
  const abrirEditar = v => { setVadForm({ nombre: v.nombre || "", descripcion: v.descripcion || "", activo: v.activo !== false }); setVadErrs({}); setVadModal({ modo: "editar", vademecum: v }); };

  const validar = f => {
    const e = {};
    if (!(f.nombre || "").trim()) e.nombre = "Requerido";
    setVadErrs(e);
    return Object.keys(e).length === 0;
  };

  const guardar = () => {
    if (!validar(vadForm)) return;
    const data = { nombre: vadForm.nombre.trim(), descripcion: (vadForm.descripcion || "").trim(), activo: vadForm.activo };
    if (vadModal.modo === "nuevo") {
      setVademecums(prev => [...prev, { id: Date.now(), ...data, productos: [], planes: [] }]);
    } else {
      setVademecums(prev => prev.map(v => v.id === vadModal.vademecum.id ? { ...v, ...data } : v));
    }
    setVadModal(null);
  };

  const eliminar = v => {
    setVademecums(prev => prev.filter(x => x.id !== v.id));
    setConfBaja(null);
  };

  const toggleActiva = v => setVademecums(prev => prev.map(x => x.id === v.id ? { ...x, activo: !x.activo } : x));

  const agregarProducto = (vademecum, productoId, prioridad, observacion) => {
    const p = productos.find(pr => pr.id === productoId);
    if (!p) return;
    const ya = (vademecum.productos || []).some(pp => pp.producto_id === productoId);
    if (ya) return;
    setVademecums(prev => prev.map(v => v.id === vademecum.id
      ? { ...v, productos: [...(v.productos || []), { producto_id: productoId, producto_nombre: p.nombre, prioridad: prioridad || null, observacion: (observacion || "").trim() || null }] }
      : v));
    setModalProducto(null);
    setProdSel(null);
  };

  const quitarProducto = (vademecum, productoId) => {
    setVademecums(prev => prev.map(v => v.id === vademecum.id
      ? { ...v, productos: (v.productos || []).filter(pp => pp.producto_id !== productoId) }
      : v));
  };

  // Asociación con planes se implementará más adelante

  const fld = (form, setForm, errs, key, label, type = "text", opts = {}) => {
    const err = errs[key];
    return (
      <div>
        <label style={{ fontSize: 11, color: err ? "#ef4444" : "#64748b", fontWeight: 700, display: "block", marginBottom: 4 }}>
          {label}{opts.req !== false && <span style={{ color: "#ef4444" }}> *</span>}
          {err && <span style={{ marginLeft: 6, fontSize: 10, color: "#ef4444" }}>{err}</span>}
        </label>
        <input type={type} value={form[key]} placeholder={opts.ph || ""}
          onChange={e => setForm({ ...form, [key]: type === "checkbox" ? e.target.checked : e.target.value })}
          style={{ width: "100%", padding: "9px 11px", borderRadius: 9, border: `1.5px solid ${err ? "#ef4444" : "#e2e8f0"}`, fontSize: 13, outline: "none", boxSizing: "border-box", background: err ? "#fff5f5" : "#fff" }} />
      </div>
    );
  };

  return (
    <div>
      {confBaja && (
        <Overlay onClose={() => setConfBaja(null)} zIndex={300}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 380, width: "90%", boxShadow: "0 24px 60px #0008" }}>
            <div style={{ fontSize: 28, textAlign: "center", marginBottom: 12 }}>⚠️</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#1e293b", textAlign: "center", marginBottom: 8 }}>Eliminar vademécum</div>
            <div style={{ fontSize: 13, color: "#64748b", textAlign: "center", marginBottom: 20 }}>¿Eliminar &quot;{confBaja.nombre}&quot;?</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfBaja(null)} style={{ flex: 1, padding: "11px", background: "#f1f5f9", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", color: "#64748b" }}>Cancelar</button>
              <button onClick={() => eliminar(confBaja)} style={{ flex: 1, padding: "11px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, fontWeight: 800, cursor: "pointer" }}>Eliminar</button>
            </div>
          </div>
        </Overlay>
      )}

      {vadModal && (
        <Overlay onClose={() => setVadModal(null)} zIndex={200}>
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 440, boxShadow: "0 32px 80px #0008" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>{vadModal.modo === "nuevo" ? "➕ Nuevo vademécum" : "✏️ Editar vademécum"}</div>
              <button onClick={() => setVadModal(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 13px", cursor: "pointer", fontWeight: 700, color: "#64748b" }}>✕</button>
            </div>
            <div style={{ padding: 22 }}>
              {fld(vadForm, setVadForm, vadErrs, "nombre", "Nombre")}
              <div style={{ marginTop: 14 }}>{fld(vadForm, setVadForm, vadErrs, "descripcion", "Descripción", "text", { req: false })}</div>
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={vadForm.activo} onChange={e => setVadForm({ ...vadForm, activo: e.target.checked })} />
                <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Activo</label>
              </div>
              <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
                <button onClick={() => setVadModal(null)} style={{ flex: 1, padding: "11px", background: "#f1f5f9", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", color: "#64748b" }}>Cancelar</button>
                <button onClick={guardar} style={{ flex: 1, padding: "11px", background: "#0d9488", color: "#fff", border: "none", borderRadius: 10, fontWeight: 800, cursor: "pointer" }}>Guardar</button>
              </div>
            </div>
          </div>
        </Overlay>
      )}

      {modalProducto && (
        <Overlay onClose={() => { setModalProducto(null); setProdSel(null); }} zIndex={200}>
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 420, maxHeight: "85vh", overflow: "auto", boxShadow: "0 32px 80px #0008" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>💊 Agregar producto a &quot;{modalProducto.nombre}&quot;</div>
              <button onClick={() => { setModalProducto(null); setProdSel(null); }} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 13px", cursor: "pointer", fontWeight: 700, color: "#64748b" }}>✕</button>
            </div>
            <div style={{ padding: 16 }}>
              <select value={prodSel || ""} onChange={e => setProdSel(e.target.value ? Number(e.target.value) : null)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13 }}>
                <option value="">Seleccionar producto...</option>
                {(productos || []).filter(p => !(modalProducto.productos || []).some(pp => pp.producto_id === p.id)).map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
              {prodSel && (
                <div style={{ marginTop: 14 }}>
                  <button onClick={() => agregarProducto(modalProducto, prodSel, null, null)}
                    style={{ width: "100%", padding: "10px", background: "#0d9488", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Agregar</button>
                </div>
              )}
            </div>
          </div>
        </Overlay>
      )}

      {/* Asociación de planes se agregará más adelante */}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Vademécums</h2>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{vademecums.length} vademécum(s) · Gestión de productos por vademécum</div>
        </div>
        <button onClick={abrirNuevo} style={{ display: "flex", alignItems: "center", gap: 8, background: "#0d9488", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 13, boxShadow: "0 4px 12px #0d948830" }}>
          <Icon name="plus" size={15} />Nuevo vademécum
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {vademecums.length === 0 && (
          <div style={{ background: "#fff", borderRadius: 14, padding: 40, textAlign: "center", color: "#94a3b8", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
            Sin vademécums. Hacé clic en &quot;Nuevo vademécum&quot; para crear uno.
          </div>
        )}
        {vademecums.map(v => (
          <div key={v.id} style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${v.activo ? "#e2e8f0" : "#f1f5f9"}`, overflow: "hidden", opacity: v.activo ? 1 : 0.7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px" }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: v.activo ? "#ccfbf1" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: v.activo ? "#0d9488" : "#94a3b8", flexShrink: 0 }}>
                <Icon name="book" size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{v.nombre}</span>
                  <span style={{ fontSize: 10, background: v.activo ? "#d1fae5" : "#f1f5f9", color: v.activo ? "#065f46" : "#94a3b8", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>{v.activo ? "ACTIVO" : "INACTIVO"}</span>
                  <span style={{ fontSize: 11, background: "#e0f2fe", color: "#0284c7", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>{(v.productos || []).length} prod.</span>
                </div>
                {v.descripcion && <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{v.descripcion}</div>}
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button onClick={() => setModalProducto(v)} style={{ display: "flex", alignItems: "center", gap: 5, background: "#f0f9ff", color: "#0284c7", border: "1px solid #bae6fd", borderRadius: 8, padding: "6px 11px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}><Icon name="plus" size={11} />Producto</button>
                <button onClick={() => toggleActiva(v)} style={{ background: v.activo ? "#fef3c7" : "#f0fdf4", color: v.activo ? "#92400e" : "#15803d", border: `1px solid ${v.activo ? "#fde68a" : "#bbf7d0"}`, borderRadius: 8, padding: "6px 11px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>{v.activo ? "Desactivar" : "Activar"}</button>
                <button onClick={() => abrirEditar(v)} style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}><Icon name="edit" size={13} /></button>
                <button onClick={() => setConfBaja(v)} style={{ background: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}><Icon name="x" size={13} /></button>
                <button onClick={() => setDesplegada(desplegada === v.id ? null : v.id)} style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>{desplegada === v.id ? "▲ Ocultar" : "▼ Ver detalle"}</button>
              </div>
            </div>
            {desplegada === v.id && (
              <div style={{ borderTop: "1px solid #f1f5f9", background: "#fafafa", padding: "16px 18px" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#64748b", marginBottom: 8 }}>Productos en este vademécum</div>
                  {(v.productos || []).length === 0 ? <div style={{ fontSize: 12, color: "#94a3b8" }}>Ninguno</div> : (
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12 }}>
                      {(v.productos || []).map(pp => (
                        <li key={pp.producto_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span>{pp.producto_nombre || `ID ${pp.producto_id}`}</span>
                          <button onClick={() => quitarProducto(v, pp.producto_id)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11 }}><Icon name="x" size={11} /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ABM PRESTADORES ───────────────────────────────────────────────────────────
const PRESTADOR_FORM_VACIO = { nombre: "", codigoPrestador: "", activo: true, planes: [] };

function ABMPrestadores({ obrasSociales }) {
  const [prestadores, setPrestadores] = useState([]);
  const [form, setForm]              = useState(PRESTADOR_FORM_VACIO);
  const [errs, setErrs]              = useState({});
  const [modal, setModal]            = useState(null); // null | { modo, prestador? }
  const [confBaja, setConfBaja]      = useState(null);
  const [prestadorDesp, setPrestDesp]= useState(null);
  const [modalPlan, setModalPlan]    = useState(null); // { prestador }
  const [planSel, setPlanSel]        = useState("");

  const todosPlanes = useMemo(() =>
    (obrasSociales || []).flatMap(os =>
      (os.programas || []).map(p => ({
        id: p.id,
        label: `${os.nombre} — ${p.nombre}`,
        osNombre: os.nombre,
        programaNombre: p.nombre,
      }))
    ),
    [obrasSociales]
  );

  const abrirNuevo = () => {
    setForm(PRESTADOR_FORM_VACIO);
    setErrs({});
    setModal({ modo: "nuevo" });
  };

  const abrirEditar = (pr) => {
    setForm({
      nombre: pr.nombre,
      codigoPrestador: pr.codigoPrestador,
      activo: pr.activo !== false,
      planes: pr.planes || [],
    });
    setErrs({});
    setModal({ modo: "editar", prestador: pr });
  };

  const validar = (f) => {
    const e = {};
    if (!(f.nombre || "").trim()) e.nombre = "Requerido";
    if (!(f.codigoPrestador || "").trim()) e.codigoPrestador = "Requerido";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const guardar = () => {
    if (!validar(form)) return;
    const data = {
      nombre: form.nombre.trim(),
      codigoPrestador: form.codigoPrestador.trim(),
      activo: form.activo,
      planes: form.planes || [],
    };
    if (modal.modo === "nuevo") {
      setPrestadores(prev => [...prev, { id: Date.now(), ...data }]);
    } else {
      setPrestadores(prev => prev.map(p => p.id === modal.prestador.id ? { ...p, ...data } : p));
    }
    setModal(null);
  };

  const eliminar = (pr) => {
    setPrestadores(prev => prev.filter(p => p.id !== pr.id));
    setConfBaja(null);
  };

  const toggleActivo = (pr) => {
    setPrestadores(prev => prev.map(p => p.id === pr.id ? { ...p, activo: !p.activo } : p));
  };

  const agregarPlan = (prestador, planId) => {
    if (!planId) return;
    const plan = todosPlanes.find(p => p.id === Number(planId));
    if (!plan) return;
    const ya = (prestador.planes || []).some(pl => pl.os_programa_id === plan.id);
    if (ya) return;
    setPrestadores(prev => prev.map(p => p.id === prestador.id
      ? { ...p, planes: [...(p.planes || []), { os_programa_id: plan.id, obra_social: plan.osNombre, programa: plan.programaNombre }] }
      : p
    ));
    setModalPlan(null);
    setPlanSel("");
  };

  const quitarPlan = (prestador, os_programa_id) => {
    setPrestadores(prev => prev.map(p => p.id === prestador.id
      ? { ...p, planes: (p.planes || []).filter(pl => pl.os_programa_id !== os_programa_id) }
      : p
    ));
  };

  const fld = (key, label, ph = "", type = "text") => {
    const err = errs[key];
    return (
      <div>
        <label style={{ fontSize: 11, color: err ? "#ef4444" : "#64748b", fontWeight: 700, display: "block", marginBottom: 4 }}>
          {label}<span style={{ color: "#ef4444" }}> *</span>
          {err && <span style={{ marginLeft: 6, fontSize: 10, color: "#ef4444" }}>{err}</span>}
        </label>
        <input
          type={type}
          value={form[key]}
          placeholder={ph}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
          style={{ width: "100%", padding: "9px 11px", borderRadius: 9, border: `1.5px solid ${err ? "#ef4444" : "#e2e8f0"}`, fontSize: 13, outline: "none", boxSizing: "border-box", background: err ? "#fff5f5" : "#fff" }}
        />
      </div>
    );
  };

  return (
    <div>
      {/* Confirmación baja */}
      {confBaja && (
        <Overlay onClose={() => setConfBaja(null)} zIndex={300}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 380, width: "90%", boxShadow: "0 24px 60px #0008" }}>
            <div style={{ fontSize: 28, textAlign: "center", marginBottom: 12 }}>⚠️</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#1e293b", textAlign: "center", marginBottom: 8 }}>Eliminar prestador</div>
            <div style={{ fontSize: 13, color: "#64748b", textAlign: "center", marginBottom: 20 }}>¿Eliminar &quot;{confBaja.nombre}&quot;?</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfBaja(null)} style={{ flex: 1, padding: "11px", background: "#f1f5f9", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", color: "#64748b" }}>Cancelar</button>
              <button onClick={() => eliminar(confBaja)} style={{ flex: 1, padding: "11px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, fontWeight: 800, cursor: "pointer" }}>Eliminar</button>
            </div>
          </div>
        </Overlay>
      )}

      {/* Modal prestador */}
      {modal && (
        <Overlay onClose={() => setModal(null)} zIndex={200}>
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460, boxShadow: "0 32px 80px #0008" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>{modal.modo === "nuevo" ? "➕ Nuevo Prestador" : "✏️ Editar Prestador"}</div>
              <button onClick={() => setModal(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 13px", cursor: "pointer", fontWeight: 700, color: "#64748b" }}>✕</button>
            </div>
            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
              {fld("nombre", "Nombre del prestador", "ej: PAMI Mandataria X")}
              {fld("codigoPrestador", "Código prestador", "ej: 1234-ABC")}
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#1f2933", fontWeight: 600, marginTop: 4 }}>
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={e => setForm({ ...form, activo: e.target.checked })}
                  style={{ width: 16, height: 16 }}
                />
                Prestador activo
              </label>
              <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                <button onClick={() => setModal(null)} style={{ flex: 1, padding: "11px", background: "#f1f5f9", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", color: "#64748b" }}>Cancelar</button>
                <button onClick={guardar} style={{ flex: 1, padding: "11px", background: "#0f766e", color: "#fff", border: "none", borderRadius: 10, fontWeight: 800, cursor: "pointer" }}>Guardar</button>
              </div>
            </div>
          </div>
        </Overlay>
      )}

      {/* Modal agregar plan */}
      {modalPlan && (
        <Overlay onClose={() => { setModalPlan(null); setPlanSel(""); }} zIndex={200}>
          <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460, boxShadow: "0 32px 80px #0008" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>Asociar plan</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Prestador: {modalPlan.nombre}</div>
              </div>
              <button onClick={() => { setModalPlan(null); setPlanSel(""); }} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 13px", cursor: "pointer", fontWeight: 700, color: "#64748b" }}>✕</button>
            </div>
            <div style={{ padding: 22 }}>
              <label style={{ fontSize: 11, color: "#64748b", fontWeight: 700, display: "block", marginBottom: 6 }}>Plan de obra social</label>
              <select
                value={planSel}
                onChange={e => setPlanSel(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13 }}
              >
                <option value="">Seleccionar OS / plan...</option>
                {todosPlanes.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              <button
                onClick={() => agregarPlan(modalPlan, planSel)}
                disabled={!planSel}
                style={{ width: "100%", marginTop: 16, padding: "11px", background: planSel ? "#7c3aed" : "#e2e8f0", color: planSel ? "#fff" : "#94a3b8", border: "none", borderRadius: 10, fontWeight: 700, cursor: planSel ? "pointer" : "not-allowed" }}
              >
                Agregar plan
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Prestadores</h2>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{prestadores.length} prestador(es) · Código propio por prestador y planes asociados</div>
        </div>
        <button
          onClick={abrirNuevo}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "#0f766e", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 13, boxShadow: "0 4px 12px #0f766e30" }}
        >
          <Icon name="plus" size={15} />Nuevo prestador
        </button>
      </div>

      {/* Lista prestadores */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {prestadores.length === 0 && (
          <div style={{ background: "#fff", borderRadius: 14, padding: 40, textAlign: "center", color: "#94a3b8", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏥</div>
            Sin prestadores. Cargá tu primer prestador con su código.
          </div>
        )}
        {prestadores.map(pr => (
          <div key={pr.id} style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${pr.activo ? "#e2e8f0" : "#f1f5f9"}`, overflow: "hidden", opacity: pr.activo ? 1 : 0.7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px" }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: pr.activo ? "#ecfeff" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: pr.activo ? "#0e7490" : "#94a3b8", flexShrink: 0 }}>
                {pr.nombre.substring(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{pr.nombre}</span>
                  <span style={{ fontSize: 10, background: pr.activo ? "#d1fae5" : "#f1f5f9", color: pr.activo ? "#065f46" : "#94a3b8", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>
                    {pr.activo ? "ACTIVO" : "INACTIVO"}
                  </span>
                  <span style={{ fontSize: 11, background: "#e0f2fe", color: "#0284c7", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>
                    Código: {pr.codigoPrestador}
                  </span>
                  <span style={{ fontSize: 11, background: "#f5f3ff", color: "#7c3aed", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>
                    {(pr.planes || []).length} planes
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => setModalPlan(pr)}
                  style={{ display: "flex", alignItems: "center", gap: 5, background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe", borderRadius: 8, padding: "6px 11px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}
                >
                  <Icon name="plus" size={11} />Plan
                </button>
                <button
                  onClick={() => toggleActivo(pr)}
                  style={{ background: pr.activo ? "#fef3c7" : "#f0fdf4", color: pr.activo ? "#92400e" : "#15803d", border: `1px solid ${pr.activo ? "#fde68a" : "#bbf7d0"}`, borderRadius: 8, padding: "6px 11px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}
                >
                  {pr.activo ? "Desactivar" : "Activar"}
                </button>
                <button
                  onClick={() => abrirEditar(pr)}
                  style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}
                >
                  <Icon name="edit" size={13} />
                </button>
                <button
                  onClick={() => setConfBaja(pr)}
                  style={{ background: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}
                >
                  <Icon name="x" size={13} />
                </button>
                <button
                  onClick={() => setPrestDesp(prestadorDesp === pr.id ? null : pr.id)}
                  style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}
                >
                  {prestadorDesp === pr.id ? "▲ Ocultar" : "▼ Ver detalle"}
                </button>
              </div>
            </div>
            {prestadorDesp === pr.id && (
              <div style={{ borderTop: "1px solid #f1f5f9", background: "#fafafa", padding: "14px 18px" }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: "#64748b", marginBottom: 8 }}>Planes asociados</div>
                {(pr.planes || []).length === 0 ? (
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>No hay planes asociados.</div>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12 }}>
                    {(pr.planes || []).map(pl => (
                      <li key={pl.os_programa_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span>{pl.obra_social} — {pl.programa}</span>
                        <button
                          onClick={() => quitarPlan(pr, pl.os_programa_id)}
                          style={{ background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11 }}
                        >
                          <Icon name="x" size={11} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── STOCK ─────────────────────────────────────────────────────────────────────
const CATEGORIAS_LIST = ["Analgésico","Antibiótico","Gastro","Cardiovascular","Diabetología","Dermatología","Respiratorio","Vitaminas","Varios"];
const FORM_VACIO = { codigoBarras:"", codigoAlfabeta:"", nombre:"", descripcionCorta:"", laboratorio:"", categoria:"Analgésico", precio:"", precioCompra:"", stock:"", stockMin:"5", descripcionLarga:"" };

function Stock({ productos, setProductos }) {
  const prods    = productos;
  const setProds = setProductos;
  const [buscar, setBuscar]   = useState("");
  const [modal, setModal]     = useState(null); // null | { modo:"nuevo"|"editar", prod }
  const [form, setForm]       = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});

  // Búsqueda por nombre, código barras, código alfabeta y laboratorio
  const filtrados = prods.filter(p => {
    const q = buscar.toLowerCase();
    return !q
      || p.nombre.toLowerCase().includes(q)
      || p.codigoBarras.includes(q)
      || p.codigoAlfabeta.toLowerCase().includes(q)
      || p.laboratorio.toLowerCase().includes(q)
      || p.categoria.toLowerCase().includes(q);
  });

  const abrirNuevo = () => {
    setForm(FORM_VACIO);
    setErrores({});
    setModal({ modo:"nuevo" });
  };

  const abrirEditar = (p) => {
    setForm({
      codigoBarras:   p.codigoBarras,
      codigoAlfabeta: p.codigoAlfabeta,
      nombre:         p.nombre,
      descripcionCorta: p.descripcionCorta || "",
      laboratorio:    p.laboratorio,
      categoria:      p.categoria,
      precio:         String(p.precio),
      precioCompra:   String(p.precioCompra),
      stock:          String(p.stock),
      stockMin:       String(p.stockMin),
      descripcionLarga: p.descripcionLarga || "",
    });
    setErrores({});
    setModal({ modo:"editar", prod: p });
  };

  const validar = () => {
    const e = {};
    if (!form.codigoBarras.trim())   e.codigoBarras   = "Requerido";
    if (!form.codigoAlfabeta.trim()) e.codigoAlfabeta = "Requerido";
    if (!form.nombre.trim())         e.nombre         = "Requerido";
    if (!form.laboratorio.trim())    e.laboratorio    = "Requerido";
    if (!form.precio || isNaN(form.precio))       e.precio      = "Número válido";
    if (!form.precioCompra || isNaN(form.precioCompra)) e.precioCompra = "Número válido";
    if (!form.stock || isNaN(form.stock))         e.stock       = "Número válido";
    if (!form.stockMin || isNaN(form.stockMin))   e.stockMin    = "Número válido";
    // Código barras único (salvo en edición del mismo)
    const duplicadoBarras = prods.find(p =>
      p.codigoBarras === form.codigoBarras.trim() &&
      (modal?.modo === "nuevo" || p.id !== modal?.prod?.id)
    );
    if (duplicadoBarras) e.codigoBarras = "Ya existe";
    const duplicadoAlfa = prods.find(p =>
      p.codigoAlfabeta === form.codigoAlfabeta.trim() &&
      (modal?.modo === "nuevo" || p.id !== modal?.prod?.id)
    );
    if (duplicadoAlfa) e.codigoAlfabeta = "Ya existe";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardar = () => {
    if (!validar()) return;
    const data = {
      codigoBarras:   form.codigoBarras.trim(),
      codigoAlfabeta: form.codigoAlfabeta.trim(),
      nombre:         form.nombre.trim(),
      descripcionCorta: (form.descripcionCorta || "").trim().slice(0,20),
      laboratorio:    form.laboratorio.trim(),
      categoria:      form.categoria,
      precio:         parseFloat(form.precio),
      precioCompra:   parseFloat(form.precioCompra),
      stock:          parseInt(form.stock),
      stockMin:       parseInt(form.stockMin),
      descripcionLarga: (form.descripcionLarga || "").trim(),
    };
    if (modal.modo === "nuevo") {
      setProds(prev => [...prev, { id: Date.now(), ...data }]);
    } else {
      setProds(prev => prev.map(p => p.id === modal.prod.id ? { ...p, ...data } : p));
    }
    setModal(null);
  };

  const campo = (key, label, tipo="text", opts={}) => {
    const err = errores[key];
    return (
      <div>
        <label style={{fontSize:11,color: err?"#ef4444":"#64748b",fontWeight:700,display:"block",marginBottom:4}}>
          {label}{opts.req!==false&&<span style={{color:"#ef4444"}}> *</span>}
          {err && <span style={{marginLeft:6,fontSize:10,fontWeight:600}}>{err}</span>}
        </label>
        {key==="categoria" ? (
          <select value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
            style={{width:"100%",padding:"9px 10px",borderRadius:9,border:`1.5px solid ${err?"#ef4444":"#e2e8f0"}`,fontSize:13,outline:"none",boxSizing:"border-box",background:"#fff"}}>
            {CATEGORIAS_LIST.map(c=><option key={c}>{c}</option>)}
          </select>
        ) : (
          <input type={tipo} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
            placeholder={opts.ph||""}
            style={{width:"100%",padding:"9px 10px",borderRadius:9,border:`1.5px solid ${err?"#ef4444":"#e2e8f0"}`,fontSize:13,outline:"none",boxSizing:"border-box",background: err?"#fff5f5":"#fff"}}/>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Modal agregar / editar */}
      {modal && (
        <Overlay onClose={()=>setModal(null)} zIndex={200}>
          <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:620,maxHeight:"92vh",overflow:"auto",boxShadow:"0 32px 80px #0008"}}>

            {/* Header modal */}
            <div style={{padding:"20px 24px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#fff",zIndex:1,borderRadius:"20px 20px 0 0"}}>
              <div>
                <div style={{fontWeight:800,fontSize:17,color:"#0f172a"}}>
                  {modal.modo==="nuevo" ? "➕ Nuevo Producto" : "✏️ Editar Producto"}
                </div>
                {modal.modo==="editar" && <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{modal.prod.nombre}</div>}
              </div>
              <button onClick={()=>setModal(null)} style={{background:"#f1f5f9",border:"none",borderRadius:9,padding:"7px 14px",cursor:"pointer",fontWeight:700,color:"#64748b"}}>✕</button>
            </div>

            <div style={{padding:24,display:"flex",flexDirection:"column",gap:0}}>

              {/* Sección: Identificación */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,color:"#0ea5e9",fontWeight:800,textTransform:"uppercase",letterSpacing:.5,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{width:16,height:16,borderRadius:4,background:"#0ea5e9",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9,fontWeight:800}}>1</span>
                  Identificación
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {campo("codigoBarras",  "Código de Barras", "text", {ph:"ej: 7790040123456"})}
                  {campo("codigoAlfabeta","Código Alfabeta",  "text", {ph:"ej: ALF-001"})}
                </div>
              </div>

              {/* Sección: Datos del producto */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,color:"#8b5cf6",fontWeight:800,textTransform:"uppercase",letterSpacing:.5,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{width:16,height:16,borderRadius:4,background:"#8b5cf6",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9,fontWeight:800}}>2</span>
                  Datos del Producto
                </div>
                <div style={{display:"grid",gap:12}}>
                  {campo("nombre","Nombre completo","text",{ph:"ej: Ibuprofeno 400mg x20"})}
                  {campo("descripcionCorta","Descripción ticket (máx. 20 caracteres)","text",{ph:"ej: Ibuprofeno 400mg",req:false})}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {campo("laboratorio","Laboratorio","text",{ph:"ej: Bago"})}
                    {campo("categoria","Categoría")}
                  </div>
                  <div>
                    <label style={{fontSize:11,color:"#64748b",fontWeight:700,display:"block",marginBottom:4}}>Descripción ampliada (opcional)</label>
                    <textarea value={form.descripcionLarga||""} onChange={e=>setForm({...form,descripcionLarga:e.target.value})}
                      placeholder="Indicaciones, dosis, contraindicaciones... Se muestra en el facturador al hacer clic en ℹ"
                      rows={4} style={{width:"100%",padding:"9px 10px",borderRadius:9,border:"1.5px solid #e2e8f0",fontSize:13,outline:"none",boxSizing:"border-box",background:"#fff",resize:"vertical"}}/>
                  </div>
                </div>
              </div>

              {/* Sección: Precios */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,color:"#10b981",fontWeight:800,textTransform:"uppercase",letterSpacing:.5,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{width:16,height:16,borderRadius:4,background:"#10b981",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9,fontWeight:800}}>3</span>
                  Precios
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {campo("precioCompra","Precio de Compra ($)","number",{ph:"0"})}
                  {campo("precio","Precio de Venta ($)","number",{ph:"0"})}
                </div>
                {form.precio && form.precioCompra && parseFloat(form.precio) > 0 && (
                  <div style={{marginTop:8,padding:"8px 12px",background:"#f0fdf4",borderRadius:8,fontSize:12,color:"#15803d",fontWeight:600}}>
                    Margen: {Math.round((parseFloat(form.precio)-parseFloat(form.precioCompra))/parseFloat(form.precio)*100)}%
                    &nbsp;·&nbsp; Ganancia: {fmt(parseFloat(form.precio)-parseFloat(form.precioCompra))}
                  </div>
                )}
              </div>

              {/* Sección: Stock */}
              <div style={{marginBottom:24}}>
                <div style={{fontSize:11,color:"#f59e0b",fontWeight:800,textTransform:"uppercase",letterSpacing:.5,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{width:16,height:16,borderRadius:4,background:"#f59e0b",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9,fontWeight:800}}>4</span>
                  Stock
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {campo("stock","Stock Actual","number",{ph:"0"})}
                  {campo("stockMin","Stock Mínimo (alerta)","number",{ph:"5"})}
                </div>
                {form.stock && form.stockMin && parseInt(form.stock) <= parseInt(form.stockMin) && (
                  <div style={{marginTop:8,padding:"8px 12px",background:"#fef3c7",borderRadius:8,fontSize:12,color:"#92400e",fontWeight:600}}>
                    ⚠️ El stock actual está por debajo o igual al mínimo — se generará alerta
                  </div>
                )}
              </div>

              {/* Botones */}
              <div style={{display:"flex",gap:10}}>
                <button onClick={guardar}
                  style={{flex:2,padding:"13px",background:"#0ea5e9",color:"#fff",border:"none",borderRadius:11,fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:"0 4px 14px #0ea5e940"}}>
                  {modal.modo==="nuevo" ? "✓ Crear Producto" : "✓ Guardar Cambios"}
                </button>
                <button onClick={()=>setModal(null)}
                  style={{flex:1,padding:"13px",background:"#f1f5f9",color:"#64748b",border:"none",borderRadius:11,fontWeight:700,fontSize:14,cursor:"pointer"}}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </Overlay>
      )}

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#1e293b"}}>Stock de Productos</h2>
        <button onClick={abrirNuevo} style={{display:"flex",alignItems:"center",gap:8,background:"#0ea5e9",color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",fontWeight:700,cursor:"pointer",fontSize:13,boxShadow:"0 4px 12px #0ea5e930"}}>
          <Icon name="plus" size={15}/>Nuevo Producto
        </button>
      </div>

      {/* Buscador */}
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
        <div style={{padding:"12px 18px",borderBottom:"1px solid #f1f5f9",display:"flex",gap:10,alignItems:"center"}}>
          <Icon name="search" size={15}/>
          <input value={buscar} onChange={e=>setBuscar(e.target.value)}
            placeholder="Buscar por nombre, cód. barras, cód. alfabeta o laboratorio..."
            style={{border:"none",outline:"none",fontSize:13,flex:1,color:"#1e293b"}}/>
          {buscar && (
            <button onClick={()=>setBuscar("")} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:16,lineHeight:1}}>✕</button>
          )}
          <span style={{fontSize:12,color:"#94a3b8",whiteSpace:"nowrap"}}>{filtrados.length}/{prods.length} productos</span>
        </div>

        {/* Tabla */}
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:820}}>
            <thead>
              <tr style={{background:"#f8fafc"}}>
                {["Cód. Barras","Cód. Alfabeta","Nombre","Categoría","P. Compra","P. Venta","Margen","Stock","Estado",""].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"10px 12px",color:"#64748b",fontWeight:700,fontSize:11,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={10} style={{textAlign:"center",padding:"40px",color:"#94a3b8",fontSize:13}}>
                  <div style={{fontSize:28,marginBottom:8}}>🔍</div>Sin productos para "{buscar}"
                </td></tr>
              ) : filtrados.map(p => {
                const margen = Math.round((p.precio - p.precioCompra) / p.precio * 100);
                const bajo   = p.stock <= p.stockMin;
                return (
                  <tr key={p.id} style={{borderTop:"1px solid #f1f5f9",background: bajo ? "#fffbeb" : "transparent", transition:"background .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background= bajo?"#fef9e7":"#f8fafc"}
                    onMouseLeave={e=>e.currentTarget.style.background= bajo?"#fffbeb":"transparent"}>

                    <td style={{padding:"11px 12px",fontFamily:"monospace",color:"#64748b",fontSize:11}}>{p.codigoBarras}</td>
                    <td style={{padding:"11px 12px"}}>
                      <span style={{background:"#ede9fe",color:"#7c3aed",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,fontFamily:"monospace"}}>
                        {p.codigoAlfabeta}
                      </span>
                    </td>
                    <td style={{padding:"11px 12px"}}>
                      <div style={{fontWeight:600,color:"#1e293b"}}>{p.nombre}</div>
                      <div style={{fontSize:11,color:"#94a3b8"}}>{p.laboratorio}</div>
                    </td>
                    <td style={{padding:"11px 12px"}}><Badge color="#0ea5e9" text={p.categoria}/></td>
                    <td style={{padding:"11px 12px",color:"#64748b"}}>{fmt(p.precioCompra)}</td>
                    <td style={{padding:"11px 12px",fontWeight:700,color:"#1e293b"}}>{fmt(p.precio)}</td>
                    <td style={{padding:"11px 12px"}}>
                      <span style={{fontWeight:700,color: margen>=40?"#10b981":margen>=20?"#f59e0b":"#ef4444"}}>
                        {margen}%
                      </span>
                    </td>
                    <td style={{padding:"11px 12px",fontWeight:700,color: bajo?"#ef4444":"#1e293b"}}>{p.stock}</td>
                    <td style={{padding:"11px 12px"}}>{bajo ? <Badge color="#ef4444" text="⚠ Bajo"/> : <Badge color="#10b981" text="OK"/>}</td>
                    <td style={{padding:"11px 12px"}}>
                      <button onClick={()=>abrirEditar(p)}
                        style={{display:"flex",alignItems:"center",gap:5,background:"#f0f9ff",color:"#0284c7",border:"1px solid #bae6fd",borderRadius:7,padding:"5px 10px",cursor:"pointer",fontWeight:700,fontSize:11,whiteSpace:"nowrap"}}>
                        <Icon name="edit" size={12}/>Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── CLIENTES ABM ──────────────────────────────────────────────────────────────
const CLI_FORM_VACIO  = { nombre:"", dni:"", telefono:"", email:"", domicilio:"", fechaNac:"", activo:true };
const LEG_FORM_VACIO  = { nombre:"", os:"", programa:"", topeTotal:"", topeM:"", vencimiento:"", activo:true };
const MED_FORM_VACIO  = { nombre:"", troquel:"", cantidad:"1" };

function Clientes({ clientes, setClientes, obrasSociales }) {

  const [vista,   setVista]   = useState("lista");   // lista | detalle
  const [clienteVer, setClienteVer] = useState(null);// cliente en detalle

  // modales
  const [cliModal, setCliModal]   = useState(null);  // null | {modo, cli?}
  const [legModal, setLegModal]   = useState(null);  // null | {modo, cli, leg?}
  const [medModal, setMedModal]   = useState(null);  // null | {leg, cli}
  const [confBaja, setConfBaja]   = useState(null);  // null | {tipo, cli, leg?}

  // formularios
  const [cliForm, setCliForm]     = useState(CLI_FORM_VACIO);
  const [legForm, setLegForm]     = useState(LEG_FORM_VACIO);
  const [medForm, setMedForm]     = useState(MED_FORM_VACIO);
  const [cliErrs, setCliErrs]     = useState({});
  const [legErrs, setLegErrs]     = useState({});

  const [buscar, setBuscar]       = useState("");

  /* ── helpers clientes ── */
  const abrirNuevoCli = () => { setCliForm(CLI_FORM_VACIO); setCliErrs({}); setCliModal({modo:"nuevo"}); };
  const abrirEditCli  = cli => { setCliForm({nombre:cli.nombre,dni:cli.dni,telefono:cli.telefono,email:cli.email||"",domicilio:cli.domicilio||"",fechaNac:cli.fechaNac||"",activo:cli.activo}); setCliErrs({}); setCliModal({modo:"editar",cli}); };

  const validarCli = f => {
    const e={};
    if(!f.nombre.trim()) e.nombre="Requerido";
    if(!f.dni.trim())    e.dni="Requerido";
    const dup = clientes.find(c=>c.dni===f.dni.trim()&&(cliModal?.modo==="nuevo"||c.id!==cliModal?.cli?.id));
    if(dup) e.dni="DNI ya registrado";
    setCliErrs(e); return !Object.keys(e).length;
  };

  const guardarCli = () => {
    if(!validarCli(cliForm)) return;
    const data = { nombre:cliForm.nombre.trim(), dni:cliForm.dni.trim(), telefono:cliForm.telefono.trim(), email:cliForm.email.trim(), domicilio:cliForm.domicilio.trim(), fechaNac:cliForm.fechaNac, activo:cliForm.activo };
    if(cliModal.modo==="nuevo") {
      const nuevo = { id:Date.now(), ...data, os:[], saldo:0, legajos:[] };
      setClientes(p=>[...p, nuevo]);
    } else {
      setClientes(p=>p.map(c=>c.id===cliModal.cli.id?{...c,...data}:c));
      if(clienteVer?.id===cliModal.cli.id) setClienteVer(v=>({...v,...data}));
    }
    setCliModal(null);
  };

  const eliminarCli = cli => { setClientes(p=>p.filter(c=>c.id!==cli.id)); setConfBaja(null); if(clienteVer?.id===cli.id){setVista("lista");setClienteVer(null);} };

  /* ── helpers legajos ── */
  const abrirNuevoLeg = cli => { setLegForm(LEG_FORM_VACIO); setLegErrs({}); setLegModal({modo:"nuevo",cli}); };
  const abrirEditLeg  = (cli,leg) => {
    setLegForm({nombre:leg.nombre,os:leg.os,programa:leg.programa,topeTotal:leg.topeTotal?String(leg.topeTotal):"",topeM:leg.topeM?String(leg.topeM):"",vencimiento:leg.vencimiento||"",activo:leg.activo});
    setLegErrs({}); setLegModal({modo:"editar",cli,leg});
  };

  const validarLeg = f => {
    const e={};
    if(!f.nombre.trim()) e.nombre="Requerido";
    if(f.topeTotal&&isNaN(f.topeTotal)) e.topeTotal="Número válido";
    if(f.topeM&&isNaN(f.topeM)) e.topeM="Número válido";
    setLegErrs(e); return !Object.keys(e).length;
  };

  const guardarLeg = () => {
    if(!validarLeg(legForm)) return;
    const nuevoId = Date.now();
    const data = { nombre:legForm.nombre.trim(), os:legForm.os, programa:legForm.programa, topeTotal:legForm.topeTotal?+legForm.topeTotal:null, topeM:legForm.topeM?+legForm.topeM:null, vencimiento:legForm.vencimiento, activo:legForm.activo };
    const nuevoLeg = { id:nuevoId, ...data, consumido:0, medicamentos:[] };
    setClientes(p=>p.map(c=>{
      if(c.id!==legModal.cli.id) return c;
      const legs = legModal.modo==="nuevo"
        ? [...(c.legajos||[]), nuevoLeg]
        : (c.legajos||[]).map(l=>l.id===legModal.leg.id?{...l,...data}:l);
      return {...c,legajos:legs};
    }));
    if(clienteVer?.id===legModal.cli.id) {
      setClienteVer(v=>({
        ...v,
        legajos: legModal.modo==="nuevo"
          ? [...(v.legajos||[]), nuevoLeg]
          : (v.legajos||[]).map(l=>l.id===legModal.leg.id?{...l,...data}:l)
      }));
    }
    setLegModal(null);
  };

  const eliminarLeg = (cli,leg) => {
    setClientes(p=>p.map(c=>c.id===cli.id?{...c,legajos:(c.legajos||[]).filter(l=>l.id!==leg.id)}:c));
    if(clienteVer?.id===cli.id) setClienteVer(v=>({...v,legajos:v.legajos.filter(l=>l.id!==leg.id)}));
    setConfBaja(null);
  };

  /* ── helpers medicamentos legajo ── */
  const agregarMed = (cli,leg) => {
    if(!medForm.nombre.trim()) return;
    const nuevo = {id:Date.now(),nombre:medForm.nombre.trim(),troquel:medForm.troquel.trim(),cantidad:parseInt(medForm.cantidad)||1};
    setClientes(p=>p.map(c=>c.id!==cli.id?c:{...c,legajos:(c.legajos||[]).map(l=>l.id!==leg.id?l:{...l,medicamentos:[...(l.medicamentos||[]),nuevo]})}));
    if(clienteVer?.id===cli.id) setClienteVer(v=>({...v,legajos:v.legajos.map(l=>l.id!==leg.id?l:{...l,medicamentos:[...(l.medicamentos||[]),nuevo]})}));
    setMedForm(MED_FORM_VACIO); setMedModal(null);
  };

  const quitarMed = (cli,leg,medId) => {
    setClientes(p=>p.map(c=>c.id!==cli.id?c:{...c,legajos:(c.legajos||[]).map(l=>l.id!==leg.id?l:{...l,medicamentos:(l.medicamentos||[]).filter(m=>m.id!==medId)})}));
    if(clienteVer?.id===cli.id) setClienteVer(v=>({...v,legajos:v.legajos.map(l=>l.id!==leg.id?l:{...l,medicamentos:(l.medicamentos||[]).filter(m=>m.id!==medId)})}));
  };

  /* ── campo helper ── */
  const fld=(form,setForm,errs,key,label,type="text",opts={})=>{
    const err=errs[key];
    return(
      <div>
        <label style={{fontSize:11,color:err?"#ef4444":"#64748b",fontWeight:700,display:"block",marginBottom:4}}>
          {label}{opts.req!==false&&<span style={{color:"#ef4444"}}> *</span>}
          {err&&<span style={{marginLeft:6,fontSize:10,color:"#ef4444"}}>{err}</span>}
        </label>
        <input type={type} value={form[key]} placeholder={opts.ph||""}
          onChange={e=>setForm({...form,[key]:e.target.value})}
          style={{width:"100%",padding:"9px 11px",borderRadius:9,border:`1.5px solid ${err?"#ef4444":"#e2e8f0"}`,fontSize:13,outline:"none",boxSizing:"border-box",background:err?"#fff5f5":"#fff"}}/>
      </div>
    );
  };

  const clientesFilt = clientes.filter(c=>{
    const q=buscar.toLowerCase();
    return !q || c.nombre.toLowerCase().includes(q) || c.dni.includes(q) || (c.telefono||"").includes(q) || (c.email||"").toLowerCase().includes(q);
  });

  /* ═══════════════════════════ MODALES ═══════════════════════════ */

  /* Modal cliente */
  const ModalCliente = cliModal&&(
    <Overlay onClose={()=>setCliModal(null)} zIndex={300}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:520,boxShadow:"0 32px 80px #0008",overflow:"auto",maxHeight:"92vh"}}>
        <div style={{padding:"18px 22px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#fff",borderRadius:"20px 20px 0 0"}}>
          <div style={{fontWeight:800,fontSize:16,color:"#0f172a"}}>{cliModal.modo==="nuevo"?"➕ Nuevo Cliente":"✏️ Editar Cliente"}</div>
          <button onClick={()=>setCliModal(null)} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"6px 13px",cursor:"pointer",fontWeight:700,color:"#64748b"}}>✕</button>
        </div>
        <div style={{padding:22,display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {fld(cliForm,setCliForm,cliErrs,"nombre","Apellido y nombre","text",{ph:"ej: García, María"})}
            {fld(cliForm,setCliForm,cliErrs,"dni","DNI","text",{ph:"ej: 24.567.890"})}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {fld(cliForm,setCliForm,cliErrs,"telefono","Teléfono","text",{ph:"11-4521-3456",req:false})}
            {fld(cliForm,setCliForm,cliErrs,"email","Email","email",{ph:"mail@ejemplo.com",req:false})}
          </div>
          {fld(cliForm,setCliForm,cliErrs,"domicilio","Domicilio","text",{ph:"Av. Santa Fe 1234, CABA",req:false})}
          {fld(cliForm,setCliForm,cliErrs,"fechaNac","Fecha de nacimiento","date",{req:false})}
          <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:13,fontWeight:600,color:"#1e293b"}}>
            <input type="checkbox" checked={cliForm.activo} onChange={e=>setCliForm({...cliForm,activo:e.target.checked})} style={{width:16,height:16,cursor:"pointer"}}/>
            Cliente activo
          </label>
          <div style={{display:"flex",gap:10,marginTop:4}}>
            <button onClick={guardarCli} style={{flex:2,padding:"13px",background:"#0ea5e9",color:"#fff",border:"none",borderRadius:11,fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:"0 4px 14px #0ea5e940"}}>
              {cliModal.modo==="nuevo"?"✓ Crear Cliente":"✓ Guardar Cambios"}
            </button>
            <button onClick={()=>setCliModal(null)} style={{flex:1,padding:"13px",background:"#f1f5f9",color:"#64748b",border:"none",borderRadius:11,fontWeight:700,cursor:"pointer"}}>Cancelar</button>
          </div>
        </div>
      </div>
    </Overlay>
  );

  /* Modal legajo */
  const osActivas = (obrasSociales||[]).filter(o=>o.activa);
  const osSelLeg  = osActivas.find(o=>o.nombre===legForm.os);

  const ModalLegajo = legModal&&(
    <Overlay onClose={()=>setLegModal(null)} zIndex={300}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:560,boxShadow:"0 32px 80px #0008",overflow:"auto",maxHeight:"92vh"}}>
        <div style={{padding:"18px 22px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#fff",borderRadius:"20px 20px 0 0"}}>
          <div>
            <div style={{fontWeight:800,fontSize:16,color:"#0f172a"}}>{legModal.modo==="nuevo"?"📋 Nuevo Legajo":"✏️ Editar Legajo"}</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:2}}>👤 {legModal.cli.nombre}</div>
          </div>
          <button onClick={()=>setLegModal(null)} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"6px 13px",cursor:"pointer",fontWeight:700,color:"#64748b"}}>✕</button>
        </div>
        <div style={{padding:22,display:"flex",flexDirection:"column",gap:14}}>

          {/* Nombre legajo */}
          {fld(legForm,setLegForm,legErrs,"nombre","Nombre del legajo","text",{ph:"ej: Tratamiento HTA crónica"})}

          {/* OS + Programa */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{fontSize:11,color:"#64748b",fontWeight:700,display:"block",marginBottom:4}}>OBRA SOCIAL <span style={{color:"#ef4444"}}>*</span></label>
              <select value={legForm.os} onChange={e=>setLegForm({...legForm,os:e.target.value,programa:""})}
                style={{width:"100%",padding:"9px 11px",borderRadius:9,border:"1.5px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff"}}>
                <option value="">— Seleccionar —</option>
                {osActivas.map(o=><option key={o.id} value={o.nombre}>{o.nombre}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:11,color:"#64748b",fontWeight:700,display:"block",marginBottom:4}}>PROGRAMA</label>
              <select value={legForm.programa} onChange={e=>setLegForm({...legForm,programa:e.target.value})}
                style={{width:"100%",padding:"9px 11px",borderRadius:9,border:"1.5px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff"}} disabled={!osSelLeg}>
                <option value="">— Seleccionar —</option>
                {(osSelLeg?.programas||[]).map(p=><option key={p.id} value={p.nombre}>{p.nombre} ({p.descuento}%)</option>)}
              </select>
            </div>
          </div>

          {/* Topes */}
          <div style={{background:"#f8fafc",borderRadius:12,padding:14}}>
            <div style={{fontSize:11,color:"#f59e0b",fontWeight:800,textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:16,height:16,borderRadius:4,background:"#f59e0b",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:9,fontWeight:800}}>$</span>
              Topes de compra
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              {fld(legForm,setLegForm,legErrs,"topeTotal","Tope total ($)","number",{ph:"Sin tope = vacío",req:false})}
              {fld(legForm,setLegForm,legErrs,"topeM","Tope mensual ($)","number",{ph:"Sin tope = vacío",req:false})}
              {fld(legForm,setLegForm,legErrs,"vencimiento","Vencimiento","date",{req:false})}
            </div>
          </div>

          <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:13,fontWeight:600,color:"#1e293b"}}>
            <input type="checkbox" checked={legForm.activo} onChange={e=>setLegForm({...legForm,activo:e.target.checked})} style={{width:16,height:16,cursor:"pointer"}}/>
            Legajo activo
          </label>

          <div style={{display:"flex",gap:10}}>
            <button onClick={guardarLeg} style={{flex:2,padding:"13px",background:"#8b5cf6",color:"#fff",border:"none",borderRadius:11,fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:"0 4px 14px #8b5cf640"}}>
              {legModal.modo==="nuevo"?"✓ Crear Legajo":"✓ Guardar Legajo"}
            </button>
            <button onClick={()=>setLegModal(null)} style={{flex:1,padding:"13px",background:"#f1f5f9",color:"#64748b",border:"none",borderRadius:11,fontWeight:700,cursor:"pointer"}}>Cancelar</button>
          </div>
        </div>
      </div>
    </Overlay>
  );

  /* Modal agregar medicamento a legajo */
  const ModalMed = medModal&&(
    <Overlay onClose={()=>setMedModal(null)} zIndex={300}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:420,boxShadow:"0 32px 80px #0008"}}>
        <div style={{padding:"18px 22px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:800,fontSize:15,color:"#0f172a"}}>💊 Agregar Medicamento</div>
          <button onClick={()=>setMedModal(null)} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"6px 13px",cursor:"pointer",fontWeight:700,color:"#64748b"}}>✕</button>
        </div>
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:10}}>
          <div>
            <label style={{fontSize:11,color:"#64748b",fontWeight:700,display:"block",marginBottom:4}}>MEDICAMENTO <span style={{color:"#ef4444"}}>*</span></label>
            <input value={medForm.nombre} onChange={e=>setMedForm({...medForm,nombre:e.target.value})} placeholder="ej: Losartan 50mg x30"
              style={{width:"100%",padding:"9px 11px",borderRadius:9,border:"1.5px solid #e2e8f0",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:10}}>
            <div>
              <label style={{fontSize:11,color:"#64748b",fontWeight:700,display:"block",marginBottom:4}}>TROQUEL</label>
              <input value={medForm.troquel} onChange={e=>setMedForm({...medForm,troquel:e.target.value})} placeholder="ej: 72340"
                style={{width:"100%",padding:"9px 11px",borderRadius:9,border:"1.5px solid #e2e8f0",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{fontSize:11,color:"#64748b",fontWeight:700,display:"block",marginBottom:4}}>CANTIDAD</label>
              <input type="number" min={1} value={medForm.cantidad} onChange={e=>setMedForm({...medForm,cantidad:e.target.value})}
                style={{width:"100%",padding:"9px 11px",borderRadius:9,border:"1.5px solid #e2e8f0",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:4}}>
            <button onClick={()=>agregarMed(medModal.cli,medModal.leg)} disabled={!medForm.nombre.trim()}
              style={{flex:2,padding:"12px",background:medForm.nombre.trim()?"#0ea5e9":"#e2e8f0",color:medForm.nombre.trim()?"#fff":"#94a3b8",border:"none",borderRadius:11,fontWeight:800,fontSize:14,cursor:medForm.nombre.trim()?"pointer":"not-allowed"}}>
              ✓ Agregar
            </button>
            <button onClick={()=>setMedModal(null)} style={{flex:1,padding:"12px",background:"#f1f5f9",color:"#64748b",border:"none",borderRadius:11,fontWeight:700,cursor:"pointer"}}>Cancelar</button>
          </div>
        </div>
      </div>
    </Overlay>
  );

  /* Modal confirmación baja */
  const ModalConfirm = confBaja&&(
    <Overlay onClose={()=>setConfBaja(null)} zIndex={400}>
      <div style={{background:"#fff",borderRadius:16,padding:28,maxWidth:360,width:"90%",boxShadow:"0 24px 60px #0008",textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:12}}>⚠️</div>
        <div style={{fontWeight:800,fontSize:16,color:"#1e293b",marginBottom:8}}>
          {confBaja.tipo==="cliente"?"Eliminar Cliente":"Eliminar Legajo"}
        </div>
        <div style={{fontSize:13,color:"#64748b",marginBottom:20}}>
          {confBaja.tipo==="cliente"
            ?`¿Eliminar a "${confBaja.cli.nombre}" y todos sus legajos?`
            :`¿Eliminar el legajo "${confBaja.leg.nombre}" de ${confBaja.cli.nombre}?`}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setConfBaja(null)} style={{flex:1,padding:"11px",background:"#f1f5f9",border:"none",borderRadius:10,fontWeight:700,cursor:"pointer",color:"#64748b"}}>Cancelar</button>
          <button onClick={()=>confBaja.tipo==="cliente"?eliminarCli(confBaja.cli):eliminarLeg(confBaja.cli,confBaja.leg)}
            style={{flex:1,padding:"11px",background:"#ef4444",color:"#fff",border:"none",borderRadius:10,fontWeight:800,cursor:"pointer"}}>Eliminar</button>
        </div>
      </div>
    </Overlay>
  );

  /* ═══════════════════════════ DETALLE CLIENTE ═══════════════════════════ */
  if(vista==="detalle"&&clienteVer) {
    const cli = clientes.find(c=>c.id===clienteVer.id) || clienteVer;
    return (
      <div>
        {ModalCliente}{ModalLegajo}{ModalMed}{ModalConfirm}

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <button onClick={()=>{setVista("lista");setClienteVer(null);}} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontWeight:700,color:"#64748b",fontSize:13}}>← Volver</button>
          <div style={{flex:1}}>
            <h2 style={{margin:0,fontSize:21,fontWeight:800,color:"#1e293b"}}>{cli.nombre}</h2>
            <div style={{fontSize:12,color:"#64748b",marginTop:2}}>DNI: {cli.dni}{cli.fechaNac&&` · Nac: ${cli.fechaNac}`}</div>
          </div>
          <button onClick={()=>abrirEditCli(cli)} style={{display:"flex",alignItems:"center",gap:6,background:"#f0f9ff",color:"#0284c7",border:"1px solid #bae6fd",borderRadius:9,padding:"8px 14px",cursor:"pointer",fontWeight:700,fontSize:13}}>
            <Icon name="edit" size={13}/>Editar
          </button>
          <button onClick={()=>setConfBaja({tipo:"cliente",cli})} style={{background:"#fee2e2",color:"#ef4444",border:"1px solid #fecaca",borderRadius:9,padding:"8px 12px",cursor:"pointer"}}>
            <Icon name="x" size={14}/>
          </button>
        </div>

        {/* Info general */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
          <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e2e8f0"}}>
            <div style={{fontSize:11,color:"#0ea5e9",fontWeight:800,textTransform:"uppercase",marginBottom:12}}>📋 Datos personales</div>
            {[["Teléfono",cli.telefono||"—"],["Email",cli.email||"—"],["Domicilio",cli.domicilio||"—"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid #f8fafc",fontSize:13}}>
                <span style={{color:"#64748b",minWidth:80}}>{k}</span>
                <span style={{fontWeight:600,color:"#1e293b"}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:6}}>
              {(cli.os||[]).map(o=><Badge key={o.nombre} color="#8b5cf6" text={o.nombre}/>)}
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e2e8f0"}}>
            <div style={{fontSize:11,color:"#10b981",fontWeight:800,textTransform:"uppercase",marginBottom:12}}>💰 Cuenta corriente</div>
            <div style={{fontSize:32,fontWeight:800,color:cli.saldo<0?"#ef4444":cli.saldo>0?"#10b981":"#94a3b8",marginBottom:6}}>{fmt(cli.saldo)}</div>
            <div style={{fontSize:12,color:"#64748b"}}>{cli.saldo<0?"Saldo deudor":cli.saldo>0?"Saldo a favor":"Sin saldo pendiente"}</div>
            <div style={{marginTop:12,display:"flex",gap:6,flexWrap:"wrap"}}>
              <span style={{fontSize:11,background:cli.activo?"#d1fae5":"#f1f5f9",color:cli.activo?"#065f46":"#94a3b8",borderRadius:6,padding:"3px 10px",fontWeight:700}}>{cli.activo?"Activo":"Inactivo"}</span>
              <span style={{fontSize:11,background:"#e0f2fe",color:"#0284c7",borderRadius:6,padding:"3px 10px",fontWeight:700}}>{(cli.legajos||[]).length} legajos</span>
            </div>
          </div>
        </div>

        {/* Legajos */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h3 style={{margin:0,fontSize:16,fontWeight:800,color:"#1e293b"}}>📋 Legajos</h3>
          <button onClick={()=>abrirNuevoLeg(cli)} style={{display:"flex",alignItems:"center",gap:6,background:"#8b5cf6",color:"#fff",border:"none",borderRadius:9,padding:"8px 16px",fontWeight:700,cursor:"pointer",fontSize:12,boxShadow:"0 3px 10px #8b5cf630"}}>
            <Icon name="plus" size={13}/>Nuevo Legajo
          </button>
        </div>

        {(!cli.legajos||cli.legajos.length===0)&&(
          <div style={{background:"#fff",borderRadius:14,padding:36,textAlign:"center",border:"1px solid #e2e8f0",color:"#94a3b8"}}>
            <div style={{fontSize:28,marginBottom:8}}>📋</div>
            Sin legajos. Hacé clic en "Nuevo Legajo" para crear uno.
          </div>
        )}

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {(cli.legajos||[]).map(leg=>{
            const pctConsumido = leg.topeTotal ? Math.round((leg.consumido||0)/leg.topeTotal*100) : null;
            const alertaTope   = pctConsumido!=null && pctConsumido>=80;
            return (
              <div key={leg.id} style={{background:"#fff",borderRadius:14,border:`1.5px solid ${leg.activo?"#e2e8f0":"#f1f5f9"}`,overflow:"hidden",opacity:leg.activo?1:.7}}>

                {/* Header legajo */}
                <div style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid #f8fafc"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                      <span style={{fontWeight:700,fontSize:14,color:"#1e293b"}}>{leg.nombre}</span>
                      <span style={{fontSize:10,background:leg.activo?"#d1fae5":"#f1f5f9",color:leg.activo?"#065f46":"#94a3b8",borderRadius:5,padding:"2px 8px",fontWeight:700}}>{leg.activo?"Activo":"Inactivo"}</span>
                      {alertaTope&&<span style={{fontSize:10,background:"#fef3c7",color:"#92400e",borderRadius:5,padding:"2px 8px",fontWeight:700}}>⚠ Tope al {pctConsumido}%</span>}
                    </div>
                    <div style={{fontSize:12,color:"#64748b"}}>
                      {leg.os&&<span style={{marginRight:12}}>🏥 {leg.os}{leg.programa&&` · ${leg.programa}`}</span>}
                      {leg.vencimiento&&<span>📅 Vence: {leg.vencimiento}</span>}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>abrirEditLeg(cli,leg)} style={{background:"#f0f9ff",color:"#0284c7",border:"1px solid #bae6fd",borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>Editar</button>
                    <button onClick={()=>setConfBaja({tipo:"legajo",cli,leg})} style={{background:"#fee2e2",color:"#ef4444",border:"1px solid #fecaca",borderRadius:7,padding:"5px 8px",cursor:"pointer"}}><Icon name="x" size={11}/></button>
                  </div>
                </div>

                {/* Topes + consumo */}
                <div style={{padding:"12px 18px",display:"flex",gap:12,flexWrap:"wrap",borderBottom:"1px solid #f8fafc",background:"#fafafa"}}>
                  <div style={{flex:1,minWidth:160}}>
                    <div style={{fontSize:10,color:"#92400e",fontWeight:700,marginBottom:4}}>CONSUMIDO / TOPE TOTAL</div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{flex:1,height:8,background:"#f1f5f9",borderRadius:4,overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:4,width:`${Math.min(100,pctConsumido||0)}%`,background:alertaTope?"#f59e0b":"#10b981",transition:"width .3s"}}/>
                      </div>
                      <span style={{fontSize:12,fontWeight:700,color:alertaTope?"#92400e":"#1e293b",whiteSpace:"nowrap"}}>
                        {fmt(leg.consumido||0)} / {leg.topeTotal?fmt(leg.topeTotal):"Sin tope"}
                      </span>
                    </div>
                  </div>
                  {leg.topeM&&(
                    <div style={{textAlign:"center",padding:"0 12px",borderLeft:"1px solid #f1f5f9"}}>
                      <div style={{fontSize:10,color:"#0284c7",fontWeight:700,marginBottom:2}}>TOPE MENSUAL</div>
                      <div style={{fontWeight:800,fontSize:14,color:"#0284c7"}}>{fmt(leg.topeM)}</div>
                    </div>
                  )}
                </div>

                {/* Medicamentos */}
                <div style={{padding:"12px 18px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{fontSize:11,color:"#64748b",fontWeight:700}}>💊 MEDICAMENTOS DEL LEGAJO</div>
                    <button onClick={()=>{setMedForm(MED_FORM_VACIO);setMedModal({cli,leg});}} style={{fontSize:11,background:"#f0f9ff",color:"#0284c7",border:"1px solid #bae6fd",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontWeight:700}}>
                      + Agregar
                    </button>
                  </div>
                  {(!leg.medicamentos||leg.medicamentos.length===0)?(
                    <div style={{fontSize:12,color:"#94a3b8",textAlign:"center",padding:"10px 0"}}>Sin medicamentos registrados</div>
                  ):(
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {leg.medicamentos.map(m=>(
                        <div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8fafc",borderRadius:8,padding:"8px 12px"}}>
                          <div>
                            <span style={{fontWeight:600,fontSize:13,color:"#1e293b"}}>{m.nombre}</span>
                            {m.troquel&&<span style={{marginLeft:10,fontSize:11,color:"#94a3b8"}}>Troquel: {m.troquel}</span>}
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <span style={{background:"#e0f2fe",color:"#0284c7",borderRadius:6,padding:"2px 10px",fontSize:12,fontWeight:700}}>×{m.cantidad}/mes</span>
                            <button onClick={()=>quitarMed(cli,leg,m.id)} style={{background:"#fee2e2",color:"#ef4444",border:"none",borderRadius:6,padding:"4px 7px",cursor:"pointer"}}><Icon name="x" size={11}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════ LISTA CLIENTES ═══════════════════════════ */
  return (
    <div>
      {ModalCliente}{ModalLegajo}{ModalMed}{ModalConfirm}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#1e293b"}}>Clientes</h2>
          <div style={{fontSize:12,color:"#64748b",marginTop:3}}>{clientes.filter(c=>c.activo).length} activos · {clientes.length} total</div>
        </div>
        <button onClick={abrirNuevoCli} style={{display:"flex",alignItems:"center",gap:8,background:"#0ea5e9",color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",fontWeight:700,cursor:"pointer",fontSize:13,boxShadow:"0 4px 12px #0ea5e930"}}>
          <Icon name="plus" size={15}/>Nuevo Cliente
        </button>
      </div>

      {/* Buscador */}
      <div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",padding:"10px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
        <Icon name="search" size={15}/>
        <input value={buscar} onChange={e=>setBuscar(e.target.value)} placeholder="Buscar por nombre, DNI, teléfono o email..."
          style={{border:"none",outline:"none",fontSize:13,flex:1}}/>
        {buscar&&<button onClick={()=>setBuscar("")} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:16,padding:0}}>✕</button>}
        <span style={{fontSize:12,color:"#94a3b8",whiteSpace:"nowrap"}}>{clientesFilt.length}/{clientes.length}</span>
      </div>

      {/* Cards clientes */}
      <div style={{display:"grid",gap:10}}>
        {clientesFilt.length===0&&(
          <div style={{background:"#fff",borderRadius:14,padding:40,textAlign:"center",border:"1px solid #e2e8f0",color:"#94a3b8"}}>
            <div style={{fontSize:28,marginBottom:8}}>👤</div>
            {buscar?`Sin resultados para "${buscar}"`:"Sin clientes registrados."}
          </div>
        )}
        {clientesFilt.map(c=>(
          <div key={c.id} style={{background:"#fff",borderRadius:14,padding:"14px 18px",border:`1px solid ${c.activo?"#e2e8f0":"#f1f5f9"}`,display:"flex",alignItems:"center",gap:14,opacity:c.activo?1:.65,transition:"box-shadow .15s",cursor:"pointer"}}
            onClick={()=>{setClienteVer(c);setVista("detalle");}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px #0ea5e920"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>

            <div style={{width:46,height:46,borderRadius:"50%",background:c.activo?"#e0f2fe":"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:c.activo?"#0284c7":"#94a3b8",fontSize:17,flexShrink:0}}>{c.nombre[0]}</div>

            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                <span style={{fontWeight:700,fontSize:14,color:"#1e293b"}}>{c.nombre}</span>
                {!c.activo&&<span style={{fontSize:10,background:"#f1f5f9",color:"#94a3b8",borderRadius:5,padding:"1px 8px",fontWeight:700}}>Inactivo</span>}
                {(c.legajos||[]).length>0&&<span style={{fontSize:10,background:"#ede9fe",color:"#7c3aed",borderRadius:5,padding:"1px 8px",fontWeight:700}}>{c.legajos.length} legajo{c.legajos.length!==1?"s":""}</span>}
              </div>
              <div style={{fontSize:12,color:"#64748b"}}>DNI: {c.dni}{c.telefono&&` · ${c.telefono}`}</div>
              <div style={{marginTop:5,display:"flex",gap:4,flexWrap:"wrap"}}>
                {(c.os||[]).map(o=><Badge key={o.nombre} color="#8b5cf6" text={o.nombre}/>)}
              </div>
            </div>

            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:10,color:"#64748b",marginBottom:3}}>Saldo cta. cte.</div>
              <div style={{fontWeight:800,fontSize:16,color:c.saldo<0?"#ef4444":c.saldo>0?"#10b981":"#94a3b8"}}>{fmt(c.saldo)}</div>
            </div>

            <div style={{display:"flex",gap:6,flexShrink:0}} onClick={e=>e.stopPropagation()}>
              <button onClick={e=>{e.stopPropagation();abrirEditCli(c);}} style={{background:"#f0f9ff",color:"#0284c7",border:"1px solid #bae6fd",borderRadius:8,padding:"6px 10px",cursor:"pointer"}}><Icon name="edit" size={13}/></button>
              <button onClick={e=>{e.stopPropagation();setConfBaja({tipo:"cliente",cli:c});}} style={{background:"#fee2e2",color:"#ef4444",border:"1px solid #fecaca",borderRadius:8,padding:"6px 10px",cursor:"pointer"}}><Icon name="x" size={13}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ACTUALIZACIÓN DE PRECIOS ──────────────────────────────────────────────────
function ActualizacionPrecios({ productos, setProductos }) {

  const CATEGORIAS_FILTER = useMemo(() => ["Todas", ...[...new Set(productos.map(p=>p.categoria))].sort()], [productos]);
  const LABORATORIOS      = useMemo(() => ["Todos", ...[...new Set(productos.map(p=>p.laboratorio))].sort()], [productos]);

  const [tab,          setTab]         = useState("masivo");   // masivo | individual | historial
  const [pct,          setPct]         = useState("");
  const [tipo,         setTipo]        = useState("venta");    // venta | compra | ambos
  const [filtCat,      setFiltCat]     = useState("Todas");
  const [filtLab,      setFiltLab]     = useState("Todos");
  const [filtBuscar,   setFiltBuscar]  = useState("");
  const [seleccionados,setSeleccionados]= useState(new Set());
  const [preview,      setPreview]     = useState(false);
  const [historial,    setHistorial]   = useState([]);

  // edición individual inline
  const [editando,     setEditando]    = useState({}); // { [id]: {precio, precioCompra} }

  const prodsFilt = productos.filter(p => {
    const q = filtBuscar.toLowerCase();
    const matchCat = filtCat==="Todas" || p.categoria===filtCat;
    const matchLab = filtLab==="Todos" || p.laboratorio===filtLab;
    const matchQ   = !q || p.nombre.toLowerCase().includes(q) || p.codigoAlfabeta?.toLowerCase().includes(q);
    return matchCat && matchLab && matchQ;
  });

  const toggleSel = id => setSeleccionados(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });
  const toggleTodos = () => {
    if(seleccionados.size===prodsFilt.length) setSeleccionados(new Set());
    else setSeleccionados(new Set(prodsFilt.map(p=>p.id)));
  };

  const pctNum = parseFloat(pct) || 0;

  const calcNuevo = (precio, pctVal) => Math.round(precio * (1 + pctVal/100));

  const aplicarMasivo = () => {
    if(!pctNum || seleccionados.size===0) return;
    const afectados = productos.filter(p=>seleccionados.has(p.id));
    const entrada = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString("es-AR"),
      hora: new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}),
      tipo: `Actualización masiva ${pctNum>0?"+":""}${pctNum}%`,
      campo: tipo==="ambos"?"Venta + Compra":tipo==="venta"?"Precio de venta":"Precio de compra",
      cantidad: afectados.length,
      detalle: afectados.map(p=>({
        nombre: p.nombre,
        anterior: tipo!=="compra"?p.precio:p.precioCompra,
        nuevo:    tipo!=="compra"?calcNuevo(p.precio,pctNum):calcNuevo(p.precioCompra,pctNum),
      })),
    };
    setProductos(prev => prev.map(p => {
      if(!seleccionados.has(p.id)) return p;
      return {
        ...p,
        ...(tipo!=="compra" && {precio:       calcNuevo(p.precio, pctNum)}),
        ...(tipo!=="venta"  && {precioCompra: calcNuevo(p.precioCompra, pctNum)}),
      };
    }));
    setHistorial(h=>[entrada,...h]);
    setSeleccionados(new Set());
    setPct("");
    setPreview(false);
  };

  const guardarIndividual = (p) => {
    const e = editando[p.id];
    if(!e) return;
    const anterior = {precio:p.precio,precioCompra:p.precioCompra};
    const nuevo    = {
      precio:       e.precio      !==undefined ? (parseFloat(e.precio)      ||p.precio)       : p.precio,
      precioCompra: e.precioCompra!==undefined ? (parseFloat(e.precioCompra)||p.precioCompra) : p.precioCompra,
    };
    setProductos(prev=>prev.map(x=>x.id===p.id?{...x,...nuevo}:x));
    setHistorial(h=>[{
      id:Date.now(),
      fecha:new Date().toLocaleDateString("es-AR"),
      hora:new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}),
      tipo:"Edición individual",
      campo:"Manual",
      cantidad:1,
      detalle:[{nombre:p.nombre,anterior:anterior.precio,nuevo:nuevo.precio}],
    },...h]);
    setEditando(prev=>{const x={...prev};delete x[p.id];return x;});
  };

  const margenColor = (venta,compra) => {
    const m=(venta-compra)/compra*100;
    return m>=40?"#10b981":m>=20?"#f59e0b":"#ef4444";
  };

  /* ── PREVIEW modal ── */
  const PreviewModal = preview&&pctNum&&seleccionados.size>0&&(
    <Overlay onClose={()=>setPreview(false)} zIndex={300}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:600,maxHeight:"88vh",overflow:"auto",boxShadow:"0 32px 80px #0008"}}>
        <div style={{padding:"18px 22px",borderBottom:"1px solid #e2e8f0",position:"sticky",top:0,background:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:"20px 20px 0 0"}}>
          <div>
            <div style={{fontWeight:800,fontSize:16,color:"#0f172a"}}>Vista previa de cambios</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{seleccionados.size} productos · {pctNum>0?"+":""}{pctNum}% sobre {tipo==="ambos"?"venta + compra":tipo==="venta"?"precio de venta":"precio de compra"}</div>
          </div>
          <button onClick={()=>setPreview(false)} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"6px 13px",cursor:"pointer",fontWeight:700,color:"#64748b"}}>✕</button>
        </div>
        <div style={{overflow:"auto",maxHeight:"55vh"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead style={{position:"sticky",top:0,background:"#f8fafc"}}>
              <tr>{["Producto","Precio venta actual","→ Nuevo","Precio compra actual","→ Nuevo"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"9px 14px",color:"#64748b",fontWeight:700,fontSize:11,borderBottom:"1px solid #e2e8f0"}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {productos.filter(p=>seleccionados.has(p.id)).map(p=>(
                <tr key={p.id} style={{borderBottom:"1px solid #f8fafc"}}>
                  <td style={{padding:"10px 14px",fontWeight:600,color:"#1e293b"}}>{p.nombre}</td>
                  <td style={{padding:"10px 14px",color:"#64748b"}}>{fmt(p.precio)}</td>
                  <td style={{padding:"10px 14px",fontWeight:700,color:tipo!=="compra"?"#0ea5e9":"#94a3b8"}}>
                    {tipo!=="compra"?fmt(calcNuevo(p.precio,pctNum)):"—"}
                  </td>
                  <td style={{padding:"10px 14px",color:"#64748b"}}>{fmt(p.precioCompra)}</td>
                  <td style={{padding:"10px 14px",fontWeight:700,color:tipo!=="venta"?"#8b5cf6":"#94a3b8"}}>
                    {tipo!=="venta"?fmt(calcNuevo(p.precioCompra,pctNum)):"—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:"16px 22px",borderTop:"1px solid #e2e8f0",display:"flex",gap:10}}>
          <button onClick={aplicarMasivo} style={{flex:2,padding:"13px",background:"#10b981",color:"#fff",border:"none",borderRadius:11,fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:"0 4px 14px #10b98140"}}>
            ✓ Confirmar y aplicar
          </button>
          <button onClick={()=>setPreview(false)} style={{flex:1,padding:"13px",background:"#f1f5f9",color:"#64748b",border:"none",borderRadius:11,fontWeight:700,cursor:"pointer"}}>Cancelar</button>
        </div>
      </div>
    </Overlay>
  );

  return (
    <div>
      {PreviewModal}

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#1e293b"}}>Actualización de Precios</h2>
          <div style={{fontSize:12,color:"#64748b",marginTop:3}}>{productos.length} productos en sistema</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {[["masivo","⚡ Masivo"],["individual","✏️ Individual"],["historial","📋 Historial"]].map(([k,v])=>(
            <button key={k} onClick={()=>setTab(k)}
              style={{padding:"8px 16px",borderRadius:9,border:`2px solid ${tab===k?"#0ea5e9":"#e2e8f0"}`,background:tab===k?"#0ea5e9":"#fff",color:tab===k?"#fff":"#64748b",fontWeight:700,cursor:"pointer",fontSize:12}}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB MASIVO ── */}
      {tab==="masivo"&&(
        <div style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:20,alignItems:"start"}}>

          {/* Panel izquierdo - configuración */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            {/* Porcentaje */}
            <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:11,color:"#64748b",fontWeight:800,textTransform:"uppercase",marginBottom:12}}>Porcentaje de ajuste</div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                {[-10,-5,5,10,15,20,30].map(v=>(
                  <button key={v} onClick={()=>setPct(String(v))}
                    style={{flex:1,padding:"7px 0",borderRadius:8,border:`2px solid ${pct===String(v)?(v<0?"#ef4444":"#10b981"):"#e2e8f0"}`,background:pct===String(v)?(v<0?"#fee2e2":"#dcfce7"):"#f8fafc",color:pct===String(v)?(v<0?"#dc2626":"#15803d"):"#64748b",fontWeight:800,cursor:"pointer",fontSize:11}}>
                    {v>0?"+":""}{v}%
                  </button>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="number" value={pct} onChange={e=>setPct(e.target.value)} placeholder="Ej: 12.5"
                  style={{flex:1,padding:"10px 12px",borderRadius:9,border:`2px solid ${pctNum>0?"#10b981":pctNum<0?"#ef4444":"#e2e8f0"}`,fontSize:16,fontWeight:800,outline:"none",textAlign:"center",color:pctNum>0?"#15803d":pctNum<0?"#dc2626":"#1e293b"}}/>
                <span style={{fontWeight:800,color:"#64748b",fontSize:18}}>%</span>
              </div>
              {pctNum!==0&&<div style={{marginTop:8,fontSize:12,color:"#64748b",textAlign:"center"}}>
                $10.000 → <strong style={{color:pctNum>0?"#10b981":"#ef4444"}}>{fmt(calcNuevo(10000,pctNum))}</strong>
              </div>}
            </div>

            {/* Qué actualizar */}
            <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:11,color:"#64748b",fontWeight:800,textTransform:"uppercase",marginBottom:10}}>Actualizar precios de</div>
              {[["venta","💰 Precio de venta"],["compra","📦 Precio de compra"],["ambos","🔄 Ambos precios"]].map(([k,v])=>(
                <label key={k} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:9,border:`2px solid ${tipo===k?"#0ea5e9":"#e2e8f0"}`,background:tipo===k?"#e0f2fe":"#f8fafc",cursor:"pointer",marginBottom:6}}>
                  <input type="radio" name="tipo" value={k} checked={tipo===k} onChange={()=>setTipo(k)} style={{accentColor:"#0ea5e9"}}/>
                  <span style={{fontWeight:700,fontSize:13,color:tipo===k?"#0284c7":"#64748b"}}>{v}</span>
                </label>
              ))}
            </div>

            {/* Acción */}
            <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:12,color:"#64748b",marginBottom:10}}>
                <strong style={{color:"#1e293b"}}>{seleccionados.size}</strong> productos seleccionados
              </div>
              <button onClick={()=>{ if(pctNum&&seleccionados.size>0) setPreview(true); }}
                disabled={!pctNum||seleccionados.size===0}
                style={{width:"100%",padding:"13px",background:pctNum&&seleccionados.size>0?"#0ea5e9":"#e2e8f0",color:pctNum&&seleccionados.size>0?"#fff":"#94a3b8",border:"none",borderRadius:11,fontWeight:800,fontSize:14,cursor:pctNum&&seleccionados.size>0?"pointer":"not-allowed",boxShadow:pctNum&&seleccionados.size>0?"0 4px 14px #0ea5e940":"none"}}>
                {pctNum&&seleccionados.size>0?`👁 Vista previa — ${seleccionados.size} productos`:"Seleccioná productos y %"}
              </button>
            </div>
          </div>

          {/* Panel derecho - tabla */}
          <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>

            {/* Filtros */}
            <div style={{padding:"14px 16px",borderBottom:"1px solid #f1f5f9",display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:160,background:"#f8fafc",borderRadius:9,padding:"8px 12px",border:"1px solid #e2e8f0"}}>
                <Icon name="search" size={13}/>
                <input value={filtBuscar} onChange={e=>setFiltBuscar(e.target.value)} placeholder="Buscar producto..."
                  style={{border:"none",outline:"none",fontSize:12,flex:1,background:"transparent"}}/>
              </div>
              <select value={filtCat} onChange={e=>setFiltCat(e.target.value)} style={{padding:"8px 10px",borderRadius:9,border:"1px solid #e2e8f0",fontSize:12,outline:"none",background:"#f8fafc"}}>
                {CATEGORIAS_FILTER.map(c=><option key={c}>{c}</option>)}
              </select>
              <select value={filtLab} onChange={e=>setFiltLab(e.target.value)} style={{padding:"8px 10px",borderRadius:9,border:"1px solid #e2e8f0",fontSize:12,outline:"none",background:"#f8fafc"}}>
                {LABORATORIOS.map(l=><option key={l}>{l}</option>)}
              </select>
              <button onClick={toggleTodos} style={{padding:"8px 14px",borderRadius:9,border:"1px solid #e2e8f0",background:"#f8fafc",color:"#64748b",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                {seleccionados.size===prodsFilt.length&&prodsFilt.length>0?"☑ Quitar todos":"☐ Selec. todos"}
              </button>
            </div>

            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{background:"#f8fafc",borderBottom:"2px solid #e2e8f0"}}>
                  <th style={{padding:"10px 14px",width:36}}></th>
                  {["Producto","Laboratorio","P. Compra","P. Venta","Margen","→ Nuevo venta"].map(h=>(
                    <th key={h} style={{textAlign:"left",padding:"10px 12px",color:"#64748b",fontWeight:700,fontSize:11}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prodsFilt.map(p=>{
                  const sel = seleccionados.has(p.id);
                  const margen = Math.round((p.precio-p.precioCompra)/p.precioCompra*100);
                  const nuevoVenta = pctNum&&(tipo!=="compra") ? calcNuevo(p.precio,pctNum) : null;
                  return (
                    <tr key={p.id} onClick={()=>toggleSel(p.id)}
                      style={{borderBottom:"1px solid #f8fafc",cursor:"pointer",background:sel?"#f0f9ff":"transparent"}}
                      onMouseEnter={e=>{ if(!sel)e.currentTarget.style.background="#f8fafc"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background=sel?"#f0f9ff":"transparent"; }}>
                      <td style={{padding:"10px 14px"}}>
                        <input type="checkbox" checked={sel} onChange={()=>toggleSel(p.id)} onClick={e=>e.stopPropagation()} style={{accentColor:"#0ea5e9",width:14,height:14}}/>
                      </td>
                      <td style={{padding:"10px 12px"}}>
                        <div style={{fontWeight:600,color:"#1e293b"}}>{p.nombre}</div>
                        <div style={{fontSize:10,color:"#94a3b8"}}>{p.categoria}</div>
                      </td>
                      <td style={{padding:"10px 12px",color:"#64748b",fontSize:11}}>{p.laboratorio}</td>
                      <td style={{padding:"10px 12px",color:"#64748b"}}>{fmt(p.precioCompra)}</td>
                      <td style={{padding:"10px 12px",fontWeight:700,color:"#1e293b"}}>{fmt(p.precio)}</td>
                      <td style={{padding:"10px 12px"}}>
                        <span style={{fontSize:11,fontWeight:700,color:margenColor(p.precio,p.precioCompra)}}>{margen}%</span>
                      </td>
                      <td style={{padding:"10px 12px"}}>
                        {nuevoVenta ? (
                          <span style={{fontWeight:800,color:"#0ea5e9"}}>{fmt(nuevoVenta)}</span>
                        ) : <span style={{color:"#e2e8f0"}}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {prodsFilt.length===0&&<div style={{padding:32,textAlign:"center",color:"#94a3b8",fontSize:13}}>Sin productos para los filtros seleccionados</div>}
          </div>
        </div>
      )}

      {/* ── TAB INDIVIDUAL ── */}
      {tab==="individual"&&(
        <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid #f1f5f9",display:"flex",gap:10,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flex:1,background:"#f8fafc",borderRadius:9,padding:"8px 12px",border:"1px solid #e2e8f0"}}>
              <Icon name="search" size={13}/>
              <input value={filtBuscar} onChange={e=>setFiltBuscar(e.target.value)} placeholder="Buscar producto..."
                style={{border:"none",outline:"none",fontSize:12,flex:1,background:"transparent"}}/>
            </div>
            <select value={filtCat} onChange={e=>setFiltCat(e.target.value)} style={{padding:"8px 10px",borderRadius:9,border:"1px solid #e2e8f0",fontSize:12,outline:"none",background:"#f8fafc"}}>
              {CATEGORIAS_FILTER.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:"#f8fafc",borderBottom:"2px solid #e2e8f0"}}>
                {["Producto","P. Compra actual","P. Venta actual","Margen","Nuevo compra","Nuevo venta",""].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"10px 14px",color:"#64748b",fontWeight:700,fontSize:11}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prodsFilt.map(p=>{
                const e = editando[p.id]||{};
                const margen = Math.round((p.precio-p.precioCompra)/p.precioCompra*100);
                const enEdit = !!editando[p.id];
                return (
                  <tr key={p.id} style={{borderBottom:"1px solid #f8fafc",background:enEdit?"#f0f9ff":"transparent"}}>
                    <td style={{padding:"10px 14px"}}>
                      <div style={{fontWeight:600,color:"#1e293b",fontSize:12}}>{p.nombre}</div>
                      <div style={{fontSize:10,color:"#94a3b8"}}>{p.laboratorio} · {p.categoria}</div>
                    </td>
                    <td style={{padding:"10px 12px",color:"#64748b"}}>{fmt(p.precioCompra)}</td>
                    <td style={{padding:"10px 12px",fontWeight:700}}>{fmt(p.precio)}</td>
                    <td style={{padding:"10px 12px"}}>
                      <span style={{fontSize:11,fontWeight:700,color:margenColor(p.precio,p.precioCompra)}}>{margen}%</span>
                    </td>
                    <td style={{padding:"8px 12px"}}>
                      {enEdit
                        ? <input type="number" value={e.precioCompra!==undefined?e.precioCompra:p.precioCompra}
                            onChange={ev=>setEditando(prev=>({...prev,[p.id]:{...prev[p.id],precioCompra:ev.target.value}}))}
                            style={{width:90,padding:"6px 8px",borderRadius:7,border:"2px solid #8b5cf6",fontSize:13,fontWeight:700,outline:"none",textAlign:"right"}}/>
                        : <span style={{color:"#64748b"}}>{fmt(p.precioCompra)}</span>
                      }
                    </td>
                    <td style={{padding:"8px 12px"}}>
                      {enEdit
                        ? <input type="number" value={e.precio!==undefined?e.precio:p.precio}
                            onChange={ev=>setEditando(prev=>({...prev,[p.id]:{...prev[p.id],precio:ev.target.value}}))}
                            style={{width:90,padding:"6px 8px",borderRadius:7,border:"2px solid #0ea5e9",fontSize:13,fontWeight:700,outline:"none",textAlign:"right"}}/>
                        : <span style={{fontWeight:700}}>{fmt(p.precio)}</span>
                      }
                    </td>
                    <td style={{padding:"8px 12px"}}>
                      <div style={{display:"flex",gap:6}}>
                        {enEdit ? <>
                          <button onClick={()=>guardarIndividual(p)}
                            style={{background:"#10b981",color:"#fff",border:"none",borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:800}}>✓</button>
                          <button onClick={()=>setEditando(prev=>{const x={...prev};delete x[p.id];return x;})}
                            style={{background:"#f1f5f9",color:"#64748b",border:"none",borderRadius:7,padding:"5px 8px",cursor:"pointer"}}><Icon name="x" size={11}/></button>
                        </> : (
                          <button onClick={()=>setEditando(prev=>({...prev,[p.id]:{}}))}
                            style={{background:"#f0f9ff",color:"#0284c7",border:"1px solid #bae6fd",borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>Editar</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB HISTORIAL ── */}
      {tab==="historial"&&(
        <div>
          {historial.length===0&&(
            <div style={{background:"#fff",borderRadius:14,padding:48,textAlign:"center",border:"1px solid #e2e8f0",color:"#94a3b8"}}>
              <div style={{fontSize:32,marginBottom:8}}>📋</div>
              Sin actualizaciones registradas aún.
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {historial.map(h=>(
              <div key={h.id} style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
                <div style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #f8fafc",background:"#fafafa"}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,color:"#1e293b"}}>{h.tipo}</div>
                    <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{h.campo} · {h.cantidad} productos · {h.fecha} {h.hora}</div>
                  </div>
                  <span style={{background:"#e0f2fe",color:"#0284c7",borderRadius:8,padding:"3px 12px",fontSize:12,fontWeight:700}}>{h.cantidad} prod.</span>
                </div>
                <div style={{padding:"10px 18px",maxHeight:180,overflowY:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead><tr style={{color:"#94a3b8"}}>
                      <th style={{textAlign:"left",padding:"4px 8px",fontWeight:700}}>Producto</th>
                      <th style={{textAlign:"right",padding:"4px 8px",fontWeight:700}}>Anterior</th>
                      <th style={{textAlign:"right",padding:"4px 8px",fontWeight:700}}>Nuevo</th>
                      <th style={{textAlign:"right",padding:"4px 8px",fontWeight:700}}>Variación</th>
                    </tr></thead>
                    <tbody>
                      {h.detalle.map((d,i)=>(
                        <tr key={i} style={{borderTop:"1px solid #f1f5f9"}}>
                          <td style={{padding:"5px 8px",color:"#1e293b",fontWeight:600}}>{d.nombre}</td>
                          <td style={{padding:"5px 8px",textAlign:"right",color:"#64748b"}}>{fmt(d.anterior)}</td>
                          <td style={{padding:"5px 8px",textAlign:"right",fontWeight:700,color:"#0ea5e9"}}>{fmt(d.nuevo)}</td>
                          <td style={{padding:"5px 8px",textAlign:"right",fontWeight:700,color:d.nuevo>d.anterior?"#10b981":"#ef4444"}}>
                            {d.nuevo>d.anterior?"+":""}{fmt(d.nuevo-d.anterior)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── PROVEEDORES ───────────────────────────────────────────────────────────────
function Proveedores({ productos }) {
  const alertas=(productos||PRODUCTOS).filter(p=>p.stock<=p.stockMin);
  const [pedido,setPedido]=useState([]);
  const [prov,setProv]=useState("");
  const [enviado,setEnviado]=useState(false);
  const toggle=p=>{const e=pedido.find(x=>x.id===p.id);setPedido(e?pedido.filter(x=>x.id!==p.id):[...pedido,{...p,cant:p.stockMin*2-p.stock}]);};
  if(enviado) return <div style={{textAlign:"center",padding:60}}><div style={{fontSize:56,marginBottom:12}}>📦</div><h2 style={{color:"#10b981"}}>¡Pedido enviado!</h2><p style={{color:"#64748b"}}>{pedido.length} productos a {prov}</p><button onClick={()=>{setPedido([]);setProv("");setEnviado(false);}} style={{marginTop:16,background:"#0ea5e9",color:"#fff",border:"none",borderRadius:10,padding:"11px 28px",fontWeight:700,cursor:"pointer"}}>Nuevo pedido</button></div>;
  return (
    <div>
      <h2 style={{margin:"0 0 20px",fontSize:22,fontWeight:800,color:"#1e293b"}}>Proveedores y Pedidos</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
        <div>
          <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden",marginBottom:16}}>
            <div style={{padding:"14px 18px",background:"#fffbeb",borderBottom:"1px solid #fde68a",fontWeight:700,color:"#92400e",fontSize:13}}>⚠️ Productos bajo stock mínimo</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:"#f8fafc"}}>{["","Producto","Stock","Mín.","Pedir"].map(h=><th key={h} style={{textAlign:"left",padding:"9px 13px",color:"#64748b",fontWeight:700,fontSize:11}}>{h}</th>)}</tr></thead>
              <tbody>{alertas.map(p=>{const sel=pedido.find(x=>x.id===p.id);return(
                <tr key={p.id} style={{borderTop:"1px solid #f1f5f9",background:sel?"#f0fdf4":"transparent"}}>
                  <td style={{padding:"11px 13px"}}><input type="checkbox" checked={!!sel} onChange={()=>toggle(p)} style={{width:15,height:15,cursor:"pointer"}}/></td>
                  <td style={{padding:"11px 13px",fontWeight:600}}>{p.nombre}</td>
                  <td style={{padding:"11px 13px",color:"#ef4444",fontWeight:700}}>{p.stock}</td>
                  <td style={{padding:"11px 13px",color:"#64748b"}}>{p.stockMin}</td>
                  <td style={{padding:"11px 13px",fontWeight:700,color:"#10b981"}}>{p.stockMin*2-p.stock}</td>
                </tr>
              );})}
              </tbody>
            </table>
          </div>
          <div style={{display:"grid",gap:10}}>
            {PROVEEDORES.map(p=>(
              <div key={p.id} style={{background:"#fff",borderRadius:12,padding:"14px 18px",border:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontWeight:700,color:"#1e293b"}}>{p.nombre}</div><div style={{fontSize:12,color:"#64748b"}}>👤 {p.contacto} · 📞 {p.telefono}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontWeight:800,fontSize:16,color:p.saldo>0?"#ef4444":"#10b981"}}>{fmt(p.saldo)}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e2e8f0",height:"fit-content"}}>
          <h4 style={{margin:"0 0 14px",fontWeight:700,color:"#1e293b"}}>Generar Pedido</h4>
          <label style={{fontSize:11,color:"#64748b",fontWeight:700,display:"block",marginBottom:5}}>DROGUERÍA</label>
          <select value={prov} onChange={e=>setProv(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:9,border:"1px solid #e2e8f0",fontSize:13,marginBottom:14,outline:"none"}}>
            <option value="">Seleccionar...</option>{PROVEEDORES.map(p=><option key={p.id}>{p.nombre}</option>)}
          </select>
          {pedido.length>0&&<div style={{marginBottom:14}}>{pedido.map(i=><div key={i.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:12,borderBottom:"1px solid #f1f5f9"}}><span style={{color:"#334155"}}>{i.nombre.substring(0,25)}…</span><span style={{fontWeight:700,color:"#10b981"}}>x{i.cant}</span></div>)}</div>}
          <button disabled={!prov||pedido.length===0} onClick={()=>setEnviado(true)} style={{width:"100%",padding:"11px",background:(prov&&pedido.length>0)?"#10b981":"#e2e8f0",color:(prov&&pedido.length>0)?"#fff":"#94a3b8",border:"none",borderRadius:10,fontWeight:800,fontSize:14,cursor:(prov&&pedido.length>0)?"pointer":"not-allowed"}}>
            📦 Enviar Pedido ({pedido.length} items)
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CAJA ──────────────────────────────────────────────────────────────────────
function Caja() {
  const movs=[
    {hora:"09:00",desc:"Apertura de caja",   tipo:"apertura",monto:70000},
    {hora:"09:45",desc:"Venta F-0001 — García",tipo:"ingreso",monto:3200},
    {hora:"10:20",desc:"Venta F-0002 — López", tipo:"ingreso",monto:1850},
    {hora:"11:05",desc:"Venta F-0003 — Mostrador",tipo:"ingreso",monto:6300},
    {hora:"12:30",desc:"Pago proveedor Rofina",tipo:"egreso", monto:-5000},
    {hora:"14:15",desc:"Venta F-0004 — Fernández",tipo:"ingreso",monto:2100},
  ];
  const saldo    = movs.reduce((a,m)=>a+m.monto,0);
  const ingresos = movs.filter(m=>m.monto>0&&m.tipo!=="apertura").reduce((a,m)=>a+m.monto,0);
  const egresos  = movs.filter(m=>m.monto<0).reduce((a,m)=>a+m.monto,0);
  return (
    <div>
      <h2 style={{margin:"0 0 20px",fontSize:22,fontWeight:800,color:"#1e293b"}}>Gestión de Caja</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        {[{l:"Saldo actual",v:fmt(saldo),bg:"#e0f2fe",c:"#0284c7"},{l:"Ingresos",v:fmt(ingresos),bg:"#d1fae5",c:"#059669"},{l:"Egresos",v:fmt(Math.abs(egresos)),bg:"#fee2e2",c:"#dc2626"}].map(k=>(
          <div key={k.l} style={{background:k.bg,borderRadius:14,padding:18}}>
            <div style={{fontSize:11,color:k.c,fontWeight:700,textTransform:"uppercase",marginBottom:6}}>{k.l}</div>
            <div style={{fontSize:26,fontWeight:800,color:k.c}}>{k.v}</div>
          </div>
        ))}
      </div>
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:"1px solid #f1f5f9",fontWeight:700,color:"#1e293b",fontSize:14}}>Movimientos — Jueves 05/03/2026</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:"#f8fafc"}}>{["Hora","Descripción","Tipo","Monto"].map(h=><th key={h} style={{textAlign:"left",padding:"9px 16px",color:"#64748b",fontWeight:700,fontSize:11}}>{h}</th>)}</tr></thead>
          <tbody>{movs.map((m,i)=>(
            <tr key={i} style={{borderTop:"1px solid #f1f5f9"}}>
              <td style={{padding:"11px 16px",fontFamily:"monospace",color:"#94a3b8"}}>{m.hora}</td>
              <td style={{padding:"11px 16px",color:"#1e293b"}}>{m.desc}</td>
              <td style={{padding:"11px 16px"}}>{m.tipo==="apertura"?<Badge color="#0ea5e9" text="Apertura"/>:m.tipo==="ingreso"?<Badge color="#10b981" text="Ingreso"/>:<Badge color="#ef4444" text="Egreso"/>}</td>
              <td style={{padding:"11px 16px",fontWeight:700,color:m.monto<0?"#ef4444":m.tipo==="apertura"?"#0284c7":"#10b981"}}>{m.monto>0?"+":""}{fmt(m.monto)}</td>
            </tr>
          ))}</tbody>
        </table>
        <div style={{padding:"14px 18px",borderTop:"2px solid #0ea5e9",display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button style={{background:"#fef3c7",color:"#92400e",border:"1px solid #fde68a",borderRadius:9,padding:"9px 18px",fontWeight:700,cursor:"pointer"}}>📋 Arqueo</button>
          <button style={{background:"#fee2e2",color:"#dc2626",border:"1px solid #fecaca",borderRadius:9,padding:"9px 18px",fontWeight:700,cursor:"pointer"}}>🔒 Cerrar Caja</button>
        </div>
      </div>
    </div>
  );
}

function PanelVentas() {
  const [periodo,setPeriodo] = useState("dia"); // dia | semana | mes | anio

  const totalVentas  = useMemo(() => VENTAS.reduce((a,v)=>a+v.total,0), []);
  const totalTickets = VENTAS.length;
  const ticketProm   = totalTickets ? totalVentas/totalTickets : 0;

  const gruposVentas = useMemo(() => {
    const acc = {};
    VENTAS.forEach(v => {
      const [dd,mm,aa] = v.fecha.split("/").map(Number);
      const d = new Date(aa,mm-1,dd);
      let key,label;

      if (periodo==="dia") {
        key = v.fecha;
        label = v.fecha;
      } else if (periodo==="mes") {
        const k = `${String(mm).padStart(2,"0")}/${aa}`;
        key = k; label = k;
      } else if (periodo==="anio") {
        key = String(aa);
        label = String(aa);
      } else {
        const diaSemana = d.getDay()===0 ? 7 : d.getDay();
        const lunes = new Date(d);
        lunes.setDate(d.getDate()-diaSemana+1);
        const domingo = new Date(lunes);
        domingo.setDate(lunes.getDate()+6);
        key   = `${aa}-W${Math.ceil((((d - new Date(aa,0,1))/86400000)+1)/7)}`;
        label = `${lunes.toLocaleDateString("es-AR")} – ${domingo.toLocaleDateString("es-AR")}`;
      }

      if (!acc[key]) acc[key] = { key, label, total:0, tickets:0 };
      acc[key].total   += v.total;
      acc[key].tickets += 1;
    });
    return Object.values(acc);
  }, [periodo]);

  const distribucionMedios = useMemo(() => {
    const acc = {};
    VENTAS.forEach(v => {
      const medio = v.medio || "efectivo";
      if (!acc[medio]) acc[medio] = { medio, total:0, tickets:0 };
      acc[medio].total   += v.total;
      acc[medio].tickets += 1;
    });
    const total = Object.values(acc).reduce((s,m)=>s+m.total,0);
    return Object.values(acc)
      .map(m => ({ ...m, pct: total ? (m.total/total)*100 : 0 }))
      .sort((a,b)=>b.total-a.total);
  }, []);

  return (
    <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h3 style={{margin:0,fontSize:14,fontWeight:700,color:"#1e293b"}}>Ventas por período</h3>
        <div style={{display:"flex",gap:6,fontSize:11}}>
          {[
            {id:"dia",label:"Día"},
            {id:"semana",label:"Semana"},
            {id:"mes",label:"Mes"},
            {id:"anio",label:"Año"},
          ].map(p=>(
            <button key={p.id} onClick={()=>setPeriodo(p.id)}
              style={{
                padding:"4px 9px",
                borderRadius:999,
                border:"1px solid #e2e8f0",
                background: periodo===p.id ? "#0ea5e9" : "#f8fafc",
                color:      periodo===p.id ? "#fff"    : "#64748b",
                fontWeight:700,
                cursor:"pointer",
              }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
        <div style={{background:"#eff6ff",borderRadius:10,padding:10}}>
          <div style={{fontSize:11,color:"#3b82f6",fontWeight:700,marginBottom:4,textTransform:"uppercase"}}>Total ventas</div>
          <div style={{fontSize:20,fontWeight:800,color:"#1d4ed8"}}>{fmt(totalVentas)}</div>
        </div>
        <div style={{background:"#ecfdf5",borderRadius:10,padding:10}}>
          <div style={{fontSize:11,color:"#059669",fontWeight:700,marginBottom:4,textTransform:"uppercase"}}>Ticket promedio</div>
          <div style={{fontSize:20,fontWeight:800,color:"#047857"}}>{fmt(ticketProm)}</div>
        </div>
        <div style={{background:"#fefce8",borderRadius:10,padding:10}}>
          <div style={{fontSize:11,color:"#d97706",fontWeight:700,marginBottom:4,textTransform:"uppercase"}}>Facturas</div>
          <div style={{fontSize:20,fontWeight:800,color:"#b45309"}}>{totalTickets}</div>
        </div>
      </div>

      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:16}}>
        <thead>
          <tr style={{background:"#f8fafc"}}>
            <th style={{textAlign:"left",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>Período</th>
            <th style={{textAlign:"right",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>Tickets</th>
            <th style={{textAlign:"right",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>Total</th>
            <th style={{textAlign:"right",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>Ticket prom.</th>
          </tr>
        </thead>
        <tbody>
          {gruposVentas.map(g=>(
            <tr key={g.key} style={{borderTop:"1px solid #f1f5f9"}}>
              <td style={{padding:"6px 8px",color:"#0f172a"}}>{g.label}</td>
              <td style={{padding:"6px 8px",textAlign:"right",color:"#0f172a"}}>{g.tickets}</td>
              <td style={{padding:"6px 8px",textAlign:"right",fontWeight:600,color:"#0f172a"}}>{fmt(g.total)}</td>
              <td style={{padding:"6px 8px",textAlign:"right",color:"#64748b"}}>
                {fmt(g.tickets ? g.total/g.tickets : 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{margin:"4px 0 8px",fontSize:13,fontWeight:700,color:"#1e293b"}}>Distribución por medio de pago</h4>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead>
          <tr style={{background:"#f8fafc"}}>
            <th style={{textAlign:"left",padding:"5px 7px",color:"#64748b",fontWeight:700,fontSize:11}}>Medio</th>
            <th style={{textAlign:"right",padding:"5px 7px",color:"#64748b",fontWeight:700,fontSize:11}}>Tickets</th>
            <th style={{textAlign:"right",padding:"5px 7px",color:"#64748b",fontWeight:700,fontSize:11}}>Total</th>
            <th style={{textAlign:"right",padding:"5px 7px",color:"#64748b",fontWeight:700,fontSize:11}}>%</th>
          </tr>
        </thead>
        <tbody>
          {distribucionMedios.map(m=>(
            <tr key={m.medio} style={{borderTop:"1px solid #f1f5f9"}}>
              <td style={{padding:"5px 7px",color:"#0f172a"}}>{m.medio}</td>
              <td style={{padding:"5px 7px",textAlign:"right",color:"#0f172a"}}>{m.tickets}</td>
              <td style={{padding:"5px 7px",textAlign:"right",color:"#0f172a"}}>{fmt(m.total)}</td>
              <td style={{padding:"5px 7px",textAlign:"right",color:"#64748b"}}>{m.pct.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── REPORTES ─────────────────────────────────────────────────────────────────────
function Reportes({ productos }) {
  const productosData = productos || PRODUCTOS;

  const ventasPorDia = useMemo(() => {
    const acc = {};
    VENTAS.forEach(v => {
      acc[v.fecha] = (acc[v.fecha] || 0) + v.total;
    });
    return Object.entries(acc).map(([fecha, total]) => {
      const [d, m, a] = fecha.split("/").map(Number);
      return { fecha, total, sortKey: new Date(a, m - 1, d).getTime() };
    }).sort((a, b) => b.sortKey - a.sortKey);
  }, []);

  const ventasPorMes = useMemo(() => {
    const acc = {};
    VENTAS.forEach(v => {
      const [ , m, a ] = v.fecha.split("/").map(Number);
      const key = `${String(m).padStart(2,"0")}/${a}`;
      acc[key] = (acc[key] || 0) + v.total;
    });
    return Object.entries(acc).map(([mes, total]) => {
      const [mm, aa] = mes.split("/").map(Number);
      return { mes, total, sortKey: aa * 100 + mm };
    }).sort((a, b) => b.sortKey - a.sortKey);
  }, []);

  const ventasPorAnio = useMemo(() => {
    const acc = {};
    VENTAS.forEach(v => {
      const anio = v.fecha.split("/")[2];
      acc[anio] = (acc[anio] || 0) + v.total;
    });
    return Object.entries(acc).map(([anio, total]) => ({ anio, total })).sort((a, b) => Number(b.anio) - Number(a.anio));
  }, []);

  const ventasDetalleProductos = useMemo(() => {
    return VENTAS_POR_PRODUCTO.map(v => {
      const prod = productosData.find(p => p.id === v.productoId) || PRODUCTOS.find(p => p.id === v.productoId);
      if (!prod) return null;
      const ingreso = prod.precio * v.unidades;
      const costo   = prod.precioCompra * v.unidades;
      const margen  = ingreso - costo;
      const margenPct = ingreso ? (margen / ingreso) * 100 : 0;
      return {
        id: prod.id,
        nombre: prod.nombre,
        categoria: prod.categoria,
        unidades: v.unidades,
        ingreso,
        costo,
        margen,
        margenPct,
      };
    }).filter(Boolean).sort((a, b) => b.unidades - a.unidades);
  }, [productosData]);

  const rentabilidadPorCategoria = useMemo(() => {
    const acc = {};
    ventasDetalleProductos.forEach(v => {
      if (!acc[v.categoria]) acc[v.categoria] = { ingreso:0, costo:0, margen:0 };
      acc[v.categoria].ingreso += v.ingreso;
      acc[v.categoria].costo   += v.costo;
      acc[v.categoria].margen  += v.margen;
    });
    return Object.entries(acc).map(([categoria, vals]) => ({
      categoria,
      ...vals,
      margenPct: vals.ingreso ? (vals.margen / vals.ingreso) * 100 : 0,
    })).sort((a, b) => b.margen - a.margen);
  }, [ventasDetalleProductos]);

  const stockBajo = useMemo(
    () => productosData.filter(p => p.stock <= p.stockMin),
    [productosData]
  );

  const proximosAVencer = useMemo(() => {
    const hoy = new Date();
    const ms60dias = 60 * 24 * 60 * 60 * 1000;
    return productosData
      .filter(p => p.vencimiento)
      .map(p => ({ prod:p, fecha:new Date(p.vencimiento) }))
      .filter(({ fecha }) => {
        const diff = fecha.getTime() - hoy.getTime();
        return diff > 0 && diff <= ms60dias;
      })
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  }, [productosData]);

  const totalVentas = useMemo(
    () => VENTAS.reduce((acc, v) => acc + v.total, 0),
    []
  );

  const totalMargen = useMemo(
    () => ventasDetalleProductos.reduce((acc, v) => acc + v.margen, 0),
    [ventasDetalleProductos]
  );

  return (
    <div>
      <h2 style={{margin:"0 0 8px",fontSize:22,fontWeight:800,color:"#1e293b"}}>Reportes y Analítica</h2>
      <p style={{margin:"0 0 20px",fontSize:13,color:"#64748b"}}>
        Resumen de ventas, productos y stock para tomar decisiones rápidas en la farmacia.
      </p>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1.5fr",gap:18,marginBottom:18}}>
        <PanelVentas/>

        {/* Productos más vendidos */}
        <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:18}}>
          <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:700,color:"#1e293b"}}>Productos más vendidos</h3>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:"#f8fafc"}}>
                <th style={{textAlign:"left",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>Producto</th>
                <th style={{textAlign:"right",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>Unid.</th>
                <th style={{textAlign:"right",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>Ingresos</th>
                <th style={{textAlign:"right",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>Margen</th>
              </tr>
            </thead>
            <tbody>
              {ventasDetalleProductos.slice(0,6).map(v=>(
                <tr key={v.id} style={{borderTop:"1px solid #f1f5f9"}}>
                  <td style={{padding:"6px 8px",color:"#0f172a"}}>{v.nombre}</td>
                  <td style={{padding:"6px 8px",textAlign:"right",color:"#0f172a",fontWeight:600}}>{v.unidades}</td>
                  <td style={{padding:"6px 8px",textAlign:"right",color:"#0f172a"}}>{fmt(v.ingreso)}</td>
                  <td style={{padding:"6px 8px",textAlign:"right",fontWeight:700,color:"#16a34a"}}>{fmt(v.margen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── RENTABILIDAD ───────────────────────────────────────────────────────── */}
      <div style={{marginBottom:18}}>
        <h3 style={{margin:"0 0 12px",fontSize:16,fontWeight:800,color:"#1e293b"}}>Rentabilidad</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18}}>
          {/* Margen por producto */}
          <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:18}}>
            <h4 style={{margin:"0 0 10px",fontSize:13,fontWeight:700,color:"#1e293b"}}>Margen por producto</h4>
            <div style={{maxHeight:240,overflowY:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead style={{position:"sticky",top:0,background:"#f8fafc"}}>
                  <tr>
                    <th style={{textAlign:"left",padding:"5px 6px",color:"#64748b",fontWeight:700,fontSize:10}}>Producto</th>
                    <th style={{textAlign:"right",padding:"5px 6px",color:"#64748b",fontWeight:700,fontSize:10}}>P. Venta</th>
                    <th style={{textAlign:"right",padding:"5px 6px",color:"#64748b",fontWeight:700,fontSize:10}}>Costo</th>
                    <th style={{textAlign:"right",padding:"5px 6px",color:"#64748b",fontWeight:700,fontSize:10}}>Margen</th>
                    <th style={{textAlign:"right",padding:"5px 6px",color:"#64748b",fontWeight:700,fontSize:10}}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {productosData.map(p=>{
                    const margen = (p.precio||0)-(p.precioCompra||0);
                    const margenPct = (p.precioCompra||0)>0 ? ((margen/(p.precioCompra||1))*100) : 0;
                    const colorMargen = margenPct>=40?"#10b981":margenPct>=20?"#f59e0b":"#ef4444";
                    return (
                      <tr key={p.id} style={{borderTop:"1px solid #f1f5f9"}}>
                        <td style={{padding:"5px 6px",color:"#0f172a",fontSize:10}} title={p.nombre}>{p.nombre?.substring(0,18)}{(p.nombre?.length||0)>18?"…":""}</td>
                        <td style={{padding:"5px 6px",textAlign:"right",color:"#0f172a"}}>{fmt(p.precio)}</td>
                        <td style={{padding:"5px 6px",textAlign:"right",color:"#64748b"}}>{fmt(p.precioCompra)}</td>
                        <td style={{padding:"5px 6px",textAlign:"right",fontWeight:700,color:colorMargen}}>{fmt(margen)}</td>
                        <td style={{padding:"5px 6px",textAlign:"right",fontWeight:600,color:colorMargen}}>{margenPct.toFixed(0)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Margen por categoría */}
          <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:18}}>
            <h4 style={{margin:"0 0 10px",fontSize:13,fontWeight:700,color:"#1e293b"}}>Margen por categoría</h4>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{background:"#f8fafc"}}>
                  <th style={{textAlign:"left",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>Categoría</th>
                  <th style={{textAlign:"right",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>Ingresos</th>
                  <th style={{textAlign:"right",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>Margen</th>
                  <th style={{textAlign:"right",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>Margen %</th>
                </tr>
              </thead>
              <tbody>
                {rentabilidadPorCategoria.map(c=>(
                  <tr key={c.categoria} style={{borderTop:"1px solid #f1f5f9"}}>
                    <td style={{padding:"6px 8px",color:"#0f172a"}}>{c.categoria}</td>
                    <td style={{padding:"6px 8px",textAlign:"right",color:"#0f172a"}}>{fmt(c.ingreso)}</td>
                    <td style={{padding:"6px 8px",textAlign:"right",fontWeight:700,color:"#16a34a"}}>{fmt(c.margen)}</td>
                    <td style={{padding:"6px 8px",textAlign:"right",color:"#64748b",fontWeight:600}}>{c.margenPct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ranking productos más rentables */}
          <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:18}}>
            <h4 style={{margin:"0 0 10px",fontSize:13,fontWeight:700,color:"#1e293b"}}>Productos más rentables</h4>
            <p style={{margin:"0 0 10px",fontSize:11,color:"#64748b"}}>Ordenado por margen total aportado</p>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{background:"#f8fafc"}}>
                  <th style={{textAlign:"left",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>#</th>
                  <th style={{textAlign:"left",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>Producto</th>
                  <th style={{textAlign:"right",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>Margen</th>
                  <th style={{textAlign:"right",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:11}}>%</th>
                </tr>
              </thead>
              <tbody>
                {[...ventasDetalleProductos].sort((a,b)=>b.margen-a.margen).slice(0,8).map((v,i)=>(
                  <tr key={v.id} style={{borderTop:"1px solid #f1f5f9"}}>
                    <td style={{padding:"6px 8px",color:"#94a3b8",fontWeight:700}}>{i+1}</td>
                    <td style={{padding:"6px 8px",color:"#0f172a",fontSize:11}} title={v.nombre}>{v.nombre?.substring(0,20)}{(v.nombre?.length||0)>20?"…":""}</td>
                    <td style={{padding:"6px 8px",textAlign:"right",fontWeight:700,color:"#16a34a"}}>{fmt(v.margen)}</td>
                    <td style={{padding:"6px 8px",textAlign:"right",color:"#64748b",fontWeight:600}}>{v.margenPct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1.5fr",gap:18}}>

        {/* Stock bajo y próximos a vencer */}
        <div style={{display:"grid",gap:12}}>
          <div style={{background:"#fff",borderRadius:14,border:"1px solid #fee2e2",padding:16}}>
            <h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:"#b91c1c"}}>Stock bajo</h3>
            {stockBajo.length === 0 ? (
              <div style={{fontSize:12,color:"#64748b"}}>No hay productos bajo el mínimo.</div>
            ) : (
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{background:"#fef2f2"}}>
                    <th style={{textAlign:"left",padding:"5px 7px",color:"#b91c1c",fontWeight:700,fontSize:11}}>Producto</th>
                    <th style={{textAlign:"right",padding:"5px 7px",color:"#b91c1c",fontWeight:700,fontSize:11}}>Stock</th>
                    <th style={{textAlign:"right",padding:"5px 7px",color:"#b91c1c",fontWeight:700,fontSize:11}}>Mín.</th>
                  </tr>
                </thead>
                <tbody>
                  {stockBajo.map(p=>(
                    <tr key={p.id} style={{borderTop:"1px solid #fee2e2"}}>
                      <td style={{padding:"5px 7px",color:"#0f172a"}}>{p.nombre}</td>
                      <td style={{padding:"5px 7px",textAlign:"right",fontWeight:700,color:"#b91c1c"}}>{p.stock}</td>
                      <td style={{padding:"5px 7px",textAlign:"right",color:"#64748b"}}>{p.stockMin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={{background:"#fff",borderRadius:14,border:"1px solid #fef3c7",padding:16}}>
            <h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:"#92400e"}}>Próximos a vencer (60 días)</h3>
            {proximosAVencer.length === 0 ? (
              <div style={{fontSize:12,color:"#64748b"}}>No hay productos próximos a vencer.</div>
            ) : (
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{background:"#fffbeb"}}>
                    <th style={{textAlign:"left",padding:"5px 7px",color:"#92400e",fontWeight:700,fontSize:11}}>Producto</th>
                    <th style={{textAlign:"right",padding:"5px 7px",color:"#92400e",fontWeight:700,fontSize:11}}>Vencimiento</th>
                    <th style={{textAlign:"right",padding:"5px 7px",color:"#92400e",fontWeight:700,fontSize:11}}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {proximosAVencer.map(({prod,fecha})=>(
                    <tr key={prod.id} style={{borderTop:"1px solid #fef3c7"}}>
                      <td style={{padding:"5px 7px",color:"#0f172a"}}>{prod.nombre}</td>
                      <td style={{padding:"5px 7px",textAlign:"right",color:"#92400e",fontWeight:600}}>
                        {fecha.toLocaleDateString("es-AR")}
                      </td>
                      <td style={{padding:"5px 7px",textAlign:"right",color:"#64748b"}}>{prod.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
// ── MODAL DE COBRO (desde Dashboard) ─────────────────────────────────────────
function CobroModal({factura, onConfirmar, onCerrar}) {
  const [pagos,setPagos]=useState([]);
  const [medioActivo,setMedio]=useState(null);
  const [monto,setMonto]=useState("");
  const [cuotas,setCuotas]=useState(1);
  const [listo,setListo]=useState(false);

  const medio       = MEDIOS_PAGO.find(m=>m.id===medioActivo);
  const montoNum    = parseFloat(monto)||0;
  const recargoPct  = medio&&cuotas>1?(RECARGOS[medio.id]?.[cuotas]||0):0;
  const montoFinal  = Math.round(montoNum*(1+recargoPct/100));
  const totalPagado = pagos.reduce((a,p)=>a+p.montoBase,0);
  const pendiente   = Math.max(0,factura.total-totalPagado);
  const vuelto      = Math.max(0,totalPagado-factura.total);
  const completo    = totalPagado>=factura.total&&pagos.length>0;

  const agregarPago=()=>{
    if(!medioActivo||montoNum<=0)return;
    setPagos([...pagos,{id:Date.now(),medio:medioActivo,label:medio.label,icon:medio.icon,color:medio.color,montoBase:montoNum,montoFinal,cuotas,recargoPct}]);
    setMedio(null);setMonto("");setCuotas(1);
  };

  if(listo) return (
    <Overlay onClose={onConfirmar} zIndex={200}>
      <div style={{background:"#fff",borderRadius:20,padding:"40px 36px",textAlign:"center",maxWidth:400,width:"90%",boxShadow:"0 32px 80px #0008"}}>
        <div style={{width:68,height:68,borderRadius:"50%",background:"linear-gradient(135deg,#10b981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:30,boxShadow:"0 6px 20px #10b98140"}}>✓</div>
        <h2 style={{margin:"0 0 4px",fontSize:22,fontWeight:800,color:"#0f172a"}}>¡Cobro confirmado!</h2>
        <p style={{color:"#64748b",fontSize:13,margin:"0 0 20px"}}>{factura.id} — {factura.cliente}</p>
        <div style={{background:"#f8fafc",borderRadius:12,padding:16,marginBottom:20,textAlign:"left"}}>
          {pagos.map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f1f5f9",fontSize:13}}>
            <span>{p.icon} {p.label}{p.cuotas>1?` · ${p.cuotas} cuotas`:""}</span>
            <span style={{fontWeight:700,color:p.color}}>{fmt(p.montoFinal)}</span>
          </div>)}
          {vuelto>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",fontSize:14}}>
            <span style={{fontWeight:700,color:"#16a34a"}}>💵 Vuelto</span>
            <span style={{fontWeight:800,color:"#16a34a",fontSize:16}}>{fmt(vuelto)}</span>
          </div>}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onConfirmar} style={{flex:1,padding:"11px",background:"#0ea5e9",color:"#fff",border:"none",borderRadius:10,fontWeight:700,cursor:"pointer",fontSize:14}}>Cerrar</button>
          <button style={{flex:1,padding:"11px",background:"#f1f5f9",color:"#1e293b",border:"none",borderRadius:10,fontWeight:700,cursor:"pointer",fontSize:14}}>🖨️ Imprimir</button>
        </div>
      </div>
    </Overlay>
  );

  return (
    <Overlay onClose={onCerrar} zIndex={200}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:680,maxHeight:"90vh",overflow:"auto",boxShadow:"0 32px 80px #0008"}}>
        {/* Header */}
        <div style={{padding:"20px 24px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#fff",zIndex:1,borderRadius:"20px 20px 0 0"}}>
          <div>
            <div style={{fontWeight:800,fontSize:17,color:"#0f172a"}}>💳 Cobrar factura</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{factura.id} · {factura.cliente} · <span style={{fontWeight:700,color:"#0ea5e9"}}>{fmt(factura.total)}</span></div>
          </div>
          <button onClick={onCerrar} style={{background:"#f1f5f9",border:"none",borderRadius:9,padding:"7px 14px",cursor:"pointer",fontWeight:700,color:"#64748b",fontSize:13}}>✕ Cancelar</button>
        </div>

        <div style={{padding:24}}>
          {/* Medios */}
          <div style={{fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase",marginBottom:10}}>Seleccionar medio</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:20}}>
            {MEDIOS_PAGO.map(m=>{
              const ya=pagos.find(p=>p.medio===m.id);
              const act=medioActivo===m.id;
              return <button key={m.id} onClick={()=>setMedio(act?null:m.id)}
                style={{padding:"10px 6px",borderRadius:10,border:`2px solid ${act?m.color:ya?m.color+"55":"#e2e8f0"}`,background:act?m.color+"18":ya?m.color+"08":"#f8fafc",color:act?m.color:ya?m.color:"#64748b",cursor:"pointer",fontWeight:700,fontSize:10,textAlign:"center",position:"relative",transition:"all .12s"}}>
                <div style={{fontSize:18,marginBottom:3}}>{m.icon}</div>{m.label}
                {ya&&<div style={{position:"absolute",top:4,right:4,width:7,height:7,borderRadius:"50%",background:m.color}}/>}
              </button>;
            })}
          </div>

          {/* Form medio */}
          {medioActivo&&(
            <div style={{background:"#f8fafc",borderRadius:12,padding:16,border:`2px solid ${medio.color}44`,marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{fontSize:20}}>{medio.icon}</span>
                <span style={{fontWeight:800,color:medio.color,fontSize:14}}>{medio.label}</span>
                {pendiente>0&&<button onClick={()=>setMonto(String(Math.round(pendiente)))} style={{marginLeft:"auto",background:medio.color+"15",color:medio.color,border:`1px solid ${medio.color}33`,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                  Usar pendiente {fmt(pendiente)}
                </button>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:medio.cuotas?"1fr 1fr":"1fr",gap:12}}>
                <div>
                  <label style={{fontSize:11,color:"#64748b",fontWeight:700,display:"block",marginBottom:5}}>MONTO</label>
                  <input type="number" value={monto} onChange={e=>setMonto(e.target.value)} onKeyDown={e=>e.key==="Enter"&&agregarPago()} placeholder="0" autoFocus
                    style={{width:"100%",padding:"10px 14px",borderRadius:9,border:`2px solid ${medio.color}44`,fontSize:16,fontWeight:700,outline:"none",boxSizing:"border-box"}}/>
                </div>
                {medio.cuotas&&<div>
                  <label style={{fontSize:11,color:"#64748b",fontWeight:700,display:"block",marginBottom:5}}>CUOTAS</label>
                  <select value={cuotas} onChange={e=>setCuotas(parseInt(e.target.value))} style={{width:"100%",padding:"11px 12px",borderRadius:9,border:`2px solid ${medio.color}44`,fontSize:13,fontWeight:700,outline:"none"}}>
                    {[1,3,6,12].map(c=>{const r=RECARGOS[medio.id]?.[c];return <option key={c} value={c}>{c===1?"1 cuota":`${c} cuotas${r?` (+${r}%)`:""}`}</option>;})}
                  </select>
                </div>}
              </div>
              {recargoPct>0&&montoNum>0&&<div style={{marginTop:10,padding:"7px 12px",background:"#7c3aed15",borderRadius:8,fontSize:12,color:"#7c3aed",fontWeight:700}}>
                Recargo {cuotas} cuotas (+{recargoPct}%): {fmt(montoNum)} → {fmt(montoFinal)}
              </div>}
              <button onClick={agregarPago} disabled={montoNum<=0}
                style={{width:"100%",marginTop:12,padding:"10px",background:montoNum>0?medio.color:"#e2e8f0",color:montoNum>0?"#fff":"#94a3b8",border:"none",borderRadius:9,fontWeight:800,fontSize:14,cursor:montoNum>0?"pointer":"not-allowed"}}>
                + Agregar {medio.label}
              </button>
            </div>
          )}

          {/* Pagos agregados */}
          {pagos.map(p=>(
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8fafc",borderRadius:10,padding:"11px 14px",border:`1px solid ${p.color}33`,marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:8,background:p.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{p.icon}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:13}}>{p.label}{p.cuotas>1&&` · ${p.cuotas} cuotas`}</div>
                  {p.recargoPct>0&&<div style={{fontSize:11,color:"#94a3b8"}}>Base {fmt(p.montoBase)} +{p.recargoPct}%</div>}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontWeight:800,fontSize:15,color:p.color}}>{fmt(p.montoFinal)}</span>
                <button onClick={()=>setPagos(pagos.filter(x=>x.id!==p.id))} style={{background:"#fee2e2",color:"#ef4444",border:"none",borderRadius:6,padding:"5px 7px",cursor:"pointer"}}><Icon name="x" size={13}/></button>
              </div>
            </div>
          ))}

          {/* Totales y confirmar */}
          <div style={{marginTop:16,padding:16,background:"#0f172a",borderRadius:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13}}>
              <span style={{color:"#94a3b8"}}>Total factura</span><span style={{color:"#f1f5f9",fontWeight:700}}>{fmt(factura.total)}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:13}}>
              <span style={{color:"#94a3b8"}}>Cobrado</span><span style={{color:"#f1f5f9",fontWeight:700}}>{fmt(totalPagado)}</span>
            </div>
            <div style={{height:6,background:"#1e293b",borderRadius:4,overflow:"hidden",marginBottom:10}}>
              <div style={{height:"100%",borderRadius:4,width:`${Math.min(100,(totalPagado/factura.total)*100)}%`,background:completo?"#10b981":"#0ea5e9",transition:"width .3s"}}/>
            </div>
            {completo&&vuelto>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:"#10b98120",borderRadius:8,marginBottom:10}}>
              <span style={{color:"#10b981",fontWeight:700}}>💵 Vuelto</span>
              <span style={{fontWeight:800,color:"#10b981",fontSize:15}}>{fmt(vuelto)}</span>
            </div>}
            {!completo&&pendiente>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:"#fef3c720",borderRadius:8,marginBottom:10}}>
              <span style={{color:"#fbbf24",fontWeight:700}}>⚠ Pendiente</span>
              <span style={{fontWeight:800,color:"#fbbf24"}}>{fmt(pendiente)}</span>
            </div>}
            <button onClick={()=>completo&&setListo(true)} disabled={!completo}
              style={{width:"100%",padding:"13px",background:completo?"#10b981":"#1e293b",color:completo?"#fff":"#334155",border:"none",borderRadius:11,fontWeight:800,fontSize:15,cursor:completo?"pointer":"not-allowed",transition:"all .2s",boxShadow:completo?"0 4px 16px #10b98150":"none"}}>
              {completo?`✓ Confirmar cobro ${fmt(factura.total)}`:`Faltan ${fmt(pendiente)}`}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

const OS_INIT = [
  { id:1, codigo:"OSDE",   nombre:"OSDE",          mandataria:"Medifé",        telefono:"0800-888-6733", activa:true,
    programas:[
      { id:101, nombre:"Plan 210",             descuento:40, coseguro:0,   tope:15000, requiereReceta:true  },
      { id:102, nombre:"Plan 310",             descuento:55, coseguro:500, tope:20000, requiereReceta:true  },
      { id:103, nombre:"Plan 410",             descuento:70, coseguro:200, tope:30000, requiereReceta:true  },
      { id:104, nombre:"Medicamentos crónicos",descuento:80, coseguro:0,   tope:50000, requiereReceta:true  },
    ]},
  { id:2, codigo:"IOMA",   nombre:"IOMA",           mandataria:"Iosper",        telefono:"0800-222-4662", activa:true,
    programas:[
      { id:201, nombre:"Básico",           descuento:50,  coseguro:0,   tope:12000, requiereReceta:true },
      { id:202, nombre:"Crónico/Especial", descuento:70,  coseguro:300, tope:25000, requiereReceta:true },
      { id:203, nombre:"Oncológico",       descuento:100, coseguro:0,   tope:null,  requiereReceta:true },
    ]},
  { id:3, codigo:"SWMED",  nombre:"Swiss Medical",  mandataria:"Swiss Farma",   telefono:"0810-888-7946", activa:true,
    programas:[
      { id:301, nombre:"Plan SMG20",       descuento:35, coseguro:0,   tope:10000, requiereReceta:false },
      { id:302, nombre:"Plan SMG30",       descuento:50, coseguro:400, tope:18000, requiereReceta:true  },
      { id:303, nombre:"Programa Crónico", descuento:65, coseguro:200, tope:28000, requiereReceta:true  },
    ]},
  { id:4, codigo:"PAMI",   nombre:"PAMI",           mandataria:"PAMI Farmacia", telefono:"0800-222-7264", activa:true,
    programas:[
      { id:401, nombre:"Vademécum básico",     descuento:70,  coseguro:0,   tope:20000, requiereReceta:true },
      { id:402, nombre:"Crónicas priorizadas", descuento:100, coseguro:0,   tope:null,  requiereReceta:true },
      { id:403, nombre:"Programa RENACER",     descuento:80,  coseguro:500, tope:35000, requiereReceta:true },
    ]},
  { id:5, codigo:"GALENO", nombre:"Galeno",         mandataria:"Galeno Farma",  telefono:"0800-345-2040", activa:true,
    programas:[
      { id:501, nombre:"Plan Base", descuento:40, coseguro:0,   tope:10000, requiereReceta:false },
      { id:502, nombre:"Plan Plus", descuento:60, coseguro:300, tope:22000, requiereReceta:true  },
    ]},
];

// Orden: operación diaria → datos maestros → compras → análisis
const NAV=[
  {id:"dashboard",  label:"Dashboard",         icon:"home"},      // 1. Vista general
  {id:"factura",    label:"Facturación",        icon:"bill"},     // 2. Operación principal
  {id:"caja",       label:"Caja",               icon:"cash"},     // 3. Cobros del día
  {id:"stock",      label:"Stock",              icon:"box"},      // 4. Productos
  {id:"precios",    label:"Precios",            icon:"pct"},     // 5. Actualización precios
  {id:"os",         label:"Obras Sociales",     icon:"shield"},   // 6. Config OS
  {id:"vademecums", label:"Vademécums",         icon:"book"},    // 7. Vademécums
  {id:"prestadores",label:"Prestadores",        icon:"shield"},  // 8. Prestadores
  {id:"clientes",   label:"Clientes",           icon:"users"},   // 9. Config clientes
  {id:"proveedores",label:"Proveedores",        icon:"truck"},   // 10. Compras
  {id:"reportes",   label:"Reportes",           icon:"coin"},    // 11. Análisis
];

export default function App() {
  const [activo,setActivo]               = useState("dashboard");
  const [cobrandoFactura,setCobrandoFactura] = useState(null);
  const [obrasSociales,setObrasSociales]     = useState(OS_INIT);
  const [clientes,setClientes]               = useState(CLIENTES_INIT);
  const [productos,setProductos]             = useState(PRODUCTOS);
  const [vademecums,setVademecums]           = useState([]);

  const handleCobrarFactura = (factura, onPagado) => setCobrandoFactura({factura, onPagado});

  const sharedOS    = { obrasSociales, setObrasSociales };
  const sharedCli   = { clientes, setClientes, obrasSociales };
  const sharedProds = { productos, setProductos };

  const renderModulo = () => {
    switch(activo) {
      case "dashboard":   return <Dashboard onCobrarFactura={handleCobrarFactura} productos={productos}/>;
      case "factura":     return <Facturacion obrasSociales={obrasSociales} clientes={clientes}/>;
      case "stock":       return <Stock {...sharedProds}/>;
      case "precios":     return <ActualizacionPrecios {...sharedProds}/>;
      case "os":          return <ABMObrasSociales {...sharedOS}/>;
      case "vademecums":  return <ABMVademecums vademecums={vademecums} setVademecums={setVademecums} productos={productos} obrasSociales={obrasSociales}/>;
      case "prestadores": return <ABMPrestadores obrasSociales={obrasSociales}/>;
      case "clientes":    return <Clientes {...sharedCli}/>;
      case "proveedores": return <Proveedores productos={productos}/>;
      case "caja":        return <Caja/>;
      case "reportes":    return <Reportes productos={productos}/>;
      default:            return <Dashboard onCobrarFactura={handleCobrarFactura} productos={productos}/>;
    }
  };

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#f1f5f9"}}>
      {cobrandoFactura&&(
        <CobroModal factura={cobrandoFactura.factura}
          onConfirmar={()=>{cobrandoFactura.onPagado();setCobrandoFactura(null);}}
          onCerrar={()=>setCobrandoFactura(null)}/>
      )}
      <div style={{width:215,background:"#0f172a",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"22px 20px 14px"}}>
          <div style={{fontWeight:800,fontSize:17,color:"#f8fafc",letterSpacing:-.5}}>💊 FarmaGestión</div>
          <div style={{fontSize:11,color:"#475569",marginTop:2}}>Sistema de Farmacia</div>
        </div>
        <nav style={{flex:1,padding:"6px 10px"}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setActivo(n.id)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",background:activo===n.id?"#0ea5e9":"transparent",color:activo===n.id?"#fff":"#94a3b8",fontWeight:600,fontSize:13,cursor:"pointer",marginBottom:2,textAlign:"left",transition:"all .15s"}}
              onMouseEnter={e=>{if(activo!==n.id){e.currentTarget.style.background="#1e293b";e.currentTarget.style.color="#e2e8f0";}}}
              onMouseLeave={e=>{if(activo!==n.id){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#94a3b8";}}}>
              <Icon name={n.icon} size={15}/>{n.label}
            </button>
          ))}
        </nav>
        <div style={{padding:"14px 18px",borderTop:"1px solid #1e293b"}}>
          <div style={{fontSize:12,color:"#475569"}}>Farmacia San Martín</div>
          <div style={{fontSize:11,color:"#334155",marginTop:2}}>Jue. 05/03/2026</div>
        </div>
      </div>
      <div style={{flex:1,overflow:"auto",padding:26}}>
        {renderModulo()}
      </div>
    </div>
  );
}

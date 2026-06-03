import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Grid,
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ColorLensIcon from '@mui/icons-material/ColorLens';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`doc-tabpanel-${index}`}
      aria-labelledby={`doc-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const DocumentationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h5" sx={{ color: 'var(--text-h)', mb: 1, fontWeight: '800' }}>
        Documentación del Proyecto
      </Typography>
      <Typography variant="body2" sx={{ color: 'var(--text)', mb: 3 }}>
        Entregables y justificaciones del diseño según las especificaciones del Proyecto 2.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'var(--border)' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="academic project phases tabs"
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: 'var(--accent)' },
            '& .MuiTab-root': {
              color: 'var(--text)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              '&.Mui-selected': { color: 'var(--accent)' },
            },
          }}
        >
          <Tab icon={<AnalyticsIcon fontSize="small" />} iconPosition="start" label="1. Análisis de Requerimientos" />
          <Tab icon={<AssignmentIcon fontSize="small" />} iconPosition="start" label="2. Planificación de Variables" />
          <Tab icon={<ColorLensIcon fontSize="small" />} iconPosition="start" label="3. Diseño & Mockup" />
        </Tabs>
      </Box>

      {/* --- PANEL 1: ANALISIS --- */}
      <CustomTabPanel value={activeTab} index={0}>
        <Card sx={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: 'none' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'var(--text-h)', mb: 2, fontWeight: '700' }}>
              Descripción del Dataset y Contexto del Proyecto
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'var(--text)', lineHeight: 1.6, mb: 2 }}>
              Este proyecto utiliza un dataset obtenido de <strong>Kaggle</strong> que registra 278 modelos de aires acondicionados. La base de datos original contiene información valiosa como la marca comercial, el tonelaje (capacidad de enfriamiento), el tipo de material en el condensador, el consumo eléctrico, el tipo de gas refrigerante, el nivel de ruido operacional, la valoración de estrellas de los clientes y el precio de mercado en rupias indias (₹).
            </Typography>

            <Typography variant="subtitle1" sx={{ color: 'var(--text-h)', mt: 3, mb: 1, fontWeight: '700' }}>
              Identificación y Clasificación de Variables
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'var(--text)', mb: 2 }}>
              Para la exploración interactiva y visualizaciones del dashboard, se seleccionaron las siguientes variables críticas:
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ p: 2, backgroundColor: 'var(--border)', borderRadius: '12px', height: '100%' }}>
                  <Typography variant="subtitle2" sx={{ color: 'var(--text-h)', mb: 1, fontWeight: '700' }}>
                    Variables Numéricas de Interés
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--text)' }}>
                    <li><strong>Price (Precio):</strong> Variable continua. Permite analizar costes de adquisición y rangos de presupuesto.</li>
                    <li><strong>STAR (Calificación):</strong> Variable continua de 0.0 a 5.0 que mide el puntaje de satisfacción del usuario.</li>
                    <li><strong>Noise_level (Nivel de Ruido):</strong> Variable discreta expresada en decibelios (dB) que evalúa el confort auditivo del equipo.</li>
                    <li><strong>Ratings (Cantidad de Opiniones):</strong> Variable discreta que indica el tamaño de la muestra de opiniones por modelo.</li>
                  </ul>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ p: 2, backgroundColor: 'var(--border)', borderRadius: '12px', height: '100%' }}>
                  <Typography variant="subtitle2" sx={{ color: 'var(--text-h)', mb: 1, fontWeight: '700' }}>
                    Variables Categóricas de Interés
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--text)' }}>
                    <li><strong>Brand_name (Marca):</strong> Variable nominal que clasifica los modelos por fabricante (e.g. LG, Panasonic, Samsung, Daikin).</li>
                    <li><strong>Condenser_Coil (Condensador):</strong> Variable nominal binaria (Cobre vs Aleación) que determina la durabilidad y conductividad térmica.</li>
                    <li><strong>RefrigeranT (Gas):</strong> Variable nominal que clasifica el refrigerante químico del ciclo frío (e.g. R-32, R-22, R-410A).</li>
                    <li><strong>TOn (Capacidad):</strong> Variable discreta agrupada como categoría (e.g. 1.0, 1.5, 2.0 Ton) para la selección rápida de tamaño de habitación.</li>
                  </ul>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, borderColor: 'var(--border)' }} />

            <Typography variant="h6" sx={{ color: 'var(--text-h)', mb: 2, fontWeight: '700' }}>
              Propósito y Perfil del Usuario
            </Typography>

            <Typography variant="subtitle2" sx={{ color: 'var(--accent)', mb: 1, fontWeight: '700' }}>
              ¿Cuál es la utilidad principal del Dashboard?
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text)', lineHeight: 1.6, mb: 2 }}>
              Facilitar la toma de decisiones informada en la compra y distribución de equipos de refrigeración. El dashboard permite comparar la relación precio-calidad, encontrar marcas líderes que cumplan con bajas emisiones sonoras, y analizar qué tipo de componentes internos (cobre vs aleación) se ofrecen en el mercado actual a distintos niveles de coste.
            </Typography>

            <Typography variant="subtitle2" sx={{ color: 'var(--accent)', mb: 1, fontWeight: '700' }}>
              Perfil de Usuario Objetivo
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text)', lineHeight: 1.6 }}>
              El dashboard está diseñado para dos tipos de usuarios:
              <br />
              1. <strong>Compradores Finales:</strong> Buscan comparar modelos específicos, filtrar por su presupuesto (rango de precios), revisar el nivel de ruido para dormitorios, y seleccionar la capacidad necesaria en base a las dimensiones de su espacio (Tons).
              <br />
              2. <strong>Analistas Técnicos y de Mercado:</strong> Buscan evaluar las marcas líderes con más modelos en catálogo, analizar tendencias de tipos de refrigerantes ecológicos R-32, y cuantificar la proporción de condensadores de cobre.
            </Typography>
          </CardContent>
        </Card>
      </CustomTabPanel>

      {/* --- PANEL 2: PLANIFICACION --- */}
      <CustomTabPanel value={activeTab} index={1}>
        <Card sx={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: 'none', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'var(--text-h)', mb: 2, fontWeight: '700' }}>
              Justificación de Variables en el Dashboard
            </Typography>

            <Paper variant="outlined" sx={{ backgroundColor: 'transparent', borderColor: 'var(--border)', overflow: 'hidden', mb: 4 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: 'var(--border)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-h)' }}>Variables Involucradas</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-h)' }}>Necesidad del Usuario</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-h)' }}>Tipo de Visualización / Filtro</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ '& td': { color: 'var(--text)' } }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'var(--text-h) !important' }}>Price (Numérica)</TableCell>
                    <TableCell>Identificar cómo se distribuyen los precios de los productos y detectar los rangos de precios más recurrentes.</TableCell>
                    <TableCell>Histograma de Precios & Slider de Rango</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'var(--text-h) !important' }}>Brand_name (Categórica)</TableCell>
                    <TableCell>Comparar la cantidad de productos por fabricante para identificar cuáles dominan el catálogo de comercialización.</TableCell>
                    <TableCell>Gráfico de Barras SVG (Top Marcas) & Filtro Sidebar</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'var(--text-h) !important' }}>Brand_name + Price</TableCell>
                    <TableCell>Evaluar la dispersión de precios e identificar el coste medio por fabricante para encontrar marcas premium vs económicas.</TableCell>
                    <TableCell>Indicadores Dinámicos en Tarjetas y Grid del Catálogo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'var(--text-h) !important' }}>Condenser_Coil (Categórica)</TableCell>
                    <TableCell>Visualizar la proporción de equipos con bobinas de Cobre frente a Aleación (Alloy), crucial para evaluar vida útil y resistencia salina.</TableCell>
                    <TableCell>Gráfico Donut Dinámico</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'var(--text-h) !important' }}>RefrigeranT (Categórica)</TableCell>
                    <TableCell>Analizar la adopción de tecnologías de gas frío eficientes y ecológicas (R-32 vs R-22 o R-410A) en el inventario.</TableCell>
                    <TableCell>Gráfico Donut de Gases</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>

            <Typography variant="h6" sx={{ color: 'var(--text-h)', mb: 2, fontWeight: '700' }}>
              Justificación de Indicadores Clave (KPIs)
            </Typography>

            <Paper variant="outlined" sx={{ backgroundColor: 'transparent', borderColor: 'var(--border)', overflow: 'hidden' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: 'var(--border)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-h)' }}>Nombre del Indicador</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-h)' }}>Variables Involucradas</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-h)' }}>Justificación de Utilidad Académica / Técnica</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ '& td': { color: 'var(--text)' } }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'var(--text-h) !important' }}>Total de Modelos</TableCell>
                    <TableCell>ID único / conteo global</TableCell>
                    <TableCell>Conocer el volumen de equipos cargados tras aplicar los filtros dinámicos, midiendo el tamaño de la muestra.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'var(--text-h) !important' }}>Precio Promedio</TableCell>
                    <TableCell>Price (numérica)</TableCell>
                    <TableCell>Establecer una referencia de presupuesto base para evaluar si un equipo individual está sobre o bajo la media de mercado.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'var(--text-h) !important' }}>Valoración Media</TableCell>
                    <TableCell>STAR (numérica)</TableCell>
                    <TableCell>Cuantificar la reputación global y aceptación del catálogo según las reseñas directas de los usuarios.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'var(--text-h) !important' }}>Nivel de Ruido Promedio</TableCell>
                    <TableCell>Noise_level (numérica)</TableCell>
                    <TableCell>Monitorear el confort acústico promedio de la oferta filtrada. Niveles menores a 40 dB se consideran aptos para descanso nocturno.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'var(--text-h) !important' }}>Porcentaje de Cobre</TableCell>
                    <TableCell>Condenser_Coil (categórica)</TableCell>
                    <TableCell>Indicar la calidad material del inventario actual, ya que el cobre ofrece mejores prestaciones térmicas y menor corrosión.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </CardContent>
        </Card>
      </CustomTabPanel>

      {/* --- PANEL 3: DISENO & MOCKUP --- */}
      <CustomTabPanel value={activeTab} index={2}>
        <Card sx={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: 'none' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'var(--text-h)', mb: 2, fontWeight: '700' }}>
              Estructura de la Interfaz y Distribución de Componentes
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'var(--text)', lineHeight: 1.6, mb: 2 }}>
              La distribución visual del dashboard interactivo fue planificada en base a una estructura de tres columnas principales adaptables (Responsive Grid), optimizando la densidad de datos y la usabilidad:
            </Typography>

            <Box sx={{ my: 3, p: 2.5, backgroundColor: 'var(--border)', borderRadius: '12px', border: '1px dashed var(--accent-border)' }}>
              <Typography variant="subtitle2" sx={{ color: 'var(--accent)', mb: 2, textAlign: 'center', fontWeight: '800' }}>
                BOSQUEJO DE DISEÑO (MOCKUP ESTRUCTURAL)
              </Typography>
              
              {/* ASCII Mockup representing the web layout */}
              <pre style={{
                margin: 0,
                padding: '16px',
                backgroundColor: 'rgba(0,0,0,0.15)',
                color: 'var(--text-h)',
                borderRadius: '8px',
                fontFamily: 'Courier, monospace',
                fontSize: '0.8rem',
                overflowX: 'auto',
                lineHeight: 1.3
              }}>
{`+---------------------------------------------------------------------------------------------------+
|  [Logo AC-Dashboard]   Navegación:  [Dashboard]  [Catálogo]  [Comparador]  [Documentación]   [Modo: O] |
+---------------------------------------------------------------------------------------------------+
|  FILTROS LATERALES        |  CONTENIDO PRINCIPAL (Segun pestaña activa)                           |
|                           |                                                                       |
|  * Buscar texto           |  +-----------------------------------------------------------------+  |
|    [ Samsung         ]    |  | KPIs: Total Modelos | P. Promedio | Stars Media | Ruido Medio   |  |
|                           |  +-----------------------------------------------------------------+  |
|  * Precio Rango           |                                                                       |
|    [o======o]             |  +---------------------------------+ +------------------------------+  |
|                           |  | Gráfico 1: Top Marcas (Barras)  | | Gráfico 2: Histograma Rango  |  |
|  * Marcas                 |  | [||||||||]                      | | [||||]                       |  |
|    [x] LG     [ ] Croma   |  +---------------------------------+ +------------------------------+  |
|    [x] Panasonic          |                                                                       |
|                           |  +---------------------------------+ +------------------------------+  |
|  * Capacidad              |  | Gráfico 3: Condensador (Donut)  | | Gráfico 4: Refrigerante (Pie)|  |
|    [x] 1.5 Ton            |  | ( O )                           | | ( O )                        |  |
|                           |  +---------------------------------+ +------------------------------+  |
|  * Botón: [Limpiar Filt]  |                                                                       |
+---------------------------+-----------------------------------------------------------------------+`}
              </pre>
            </Box>

            <Typography variant="subtitle1" sx={{ color: 'var(--text-h)', mt: 3, mb: 1, fontWeight: '700' }}>
              Decisiones Clave de Experiencia de Usuario (UX)
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6 }}>
              <li><strong>Barra de Navegación Fija:</strong> Ubicada al tope de la pantalla para transitar de manera rápida entre el panel de analíticas, la tienda del catálogo, el comparador activo y la entrega técnica.</li>
              <li><strong>Retroalimentación de Filtros en Tiempo Real:</strong> Cualquier cambio en la columna de filtros (sidebar) actualiza inmediatamente la muestra de datos y reconfigura tanto las métricas de las tarjetas como los trazos de los gráficos SVG.</li>
              <li><strong>Modo Claro y Oscuro Inteligente:</strong> Respeta la preferencia inicial del sistema operativo del usuario pero permite alternar dinámicamente mediante un botón en la barra superior.</li>
              <li><strong>Indicadores de Selección de Comparación:</strong> Los productos seleccionados en el catálogo muestran un badge de estado y una barra de notificación informando cuántos modelos (máximo 3) están listos para la visualización lado a lado.</li>
            </ul>
          </CardContent>
        </Card>
      </CustomTabPanel>
    </Box>
  );
};

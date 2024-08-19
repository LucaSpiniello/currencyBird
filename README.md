# Cotizador de Divisas

## Descripción del Proyecto

Este proyecto es un cotizador de divisas que permite convertir montos entre diferentes monedas, principalmente desde y hacia CLP (pesos chilenos). El sistema está dividido en un frontend que permite la interacción del usuario y un backend construido con FastAPI que realiza las conversiones.

## Estructura del Proyecto

```plaintext
currency_bird/
├── backend/
│   ├── main.py
│   ├── main_test.py
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── styles.css
    └── script.js

## Instalación y Configuración

### Requisitos

- Python 3.x

### Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/currency_bird.git
   cd currency_bird

2. Configura el entorno del backend:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate 
    pip install -r requirements.txt

3. Inicia servidor FastApi:
    ```bash
    uvicorn main:app --reload

4. Abre el archivo .html dentro de la carpeta frontend



## Backend

### El backend está construido con FastAPI, proporcionando una API rápida y moderna para manejar las solicitudes de conversión de divisas.

### Endpoints
#### El archivo main.py define los endpoints principales:

1. /divisas/incomingCountries: Obtiene una lista de países desde los cuales se pueden recibir divisas.
2. /divisas/sendCountries: Obtiene una lista de países a los cuales se pueden enviar divisas.
3. /convert_to_chile_with_fee: Convierte una cantidad a CLP aplicando una tarifa de conversión.
4. /convert_to_chile_without_fee: Convierte una cantidad a CLP sin aplicar una tarifa de conversión.
5. /convert_from_chile_with_fee: Convierte desde CLP a otra moneda aplicando una tarifa de conversión.
6. /convert_from_chile_without_fee: Convierte desde CLP a otra moneda sin aplicar una tarifa de conversión.


## Frontend

### HTML
#### El archivo index.html estructura la interfaz del usuario. Contiene elementos como un interruptor para seleccionar la dirección de conversión y campos de entrada para ingresar montos de divisas. Además, se implementa un efecto skeleton para indicar que los datos se están cargando.

### CSS
#### El archivo styles.css define el estilo visual del cotizador. Se utilizan colores azules para darle un aspecto tecnológico y de seguridad. Los elementos interactivos como el switch y los inputs tienen un diseño moderno y minimalista.

### JavaScript
#### El archivo script.js maneja la lógica de la interfaz, incluyendo:

1. Inicialización: Carga los países disponibles y sus divisas.
2. Conversión de Monedas: Gestiona las solicitudes de conversión al backend y actualiza los valores en la interfaz.
3. Skeleton Loading: Implementa una animación de carga mientras se obtiene la información de la API.

## Testing
#### El archivo main_test.py contiene pruebas unitarias para los endpoints de la API utilizando pytest. Las pruebas cubren los casos básicos para asegurarse de que los cálculos de conversión sean correctos y que los endpoints respondan adecuadamente.

#### Para Ejecutar las Pruebas
    ```bash
    pytest main_test.py

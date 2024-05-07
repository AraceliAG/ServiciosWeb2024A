
// FUNCION PARA ASIGNAR NOMBRE DE CADA TRIMESTRE
function getTrimesterName(month) {
    if (month >= 0 && month <= 2) {
        return 'Ene-Mar'; // Enero a Marzo
    } else if (month >= 3 && month <= 5) {
        return 'Abr-Jun'; // Abril a Junio
    } else if (month >= 6 && month <= 8) {
        return 'Jul-Sep'; // Julio a Septiembre
    } else {
        return 'Oct-Dic'; // Octubre a Diciembre
    }
}

// AGRUPACION POR TRIMESTRE
function groupDataByTrimester(data) {
    const trimesters = {};
    data.forEach(item => {
        const year = new Date(item.time).getFullYear();
        const month = new Date(item.time).getMonth();
        const trimester = getTrimesterName(month);
        const trimesterKey = `${year}-${trimester}`;
        if (!trimesters[trimesterKey]) {
            trimesters[trimesterKey] = [];
        }
        trimesters[trimesterKey].push(item.value);
    });
    return trimesters;
}

// SACAR PROMEDIO DE TRIMESTRE
function calculateAverageByTrimester(trimesters) {
    const averages = {};
    Object.keys(trimesters).forEach(trimester => {
        const values = trimesters[trimester];
        const average = values.reduce((acc, curr) => acc + curr, 0) / values.length;
        averages[trimester] = average;
    });
    return averages;
}

// MOSTAR GRAFICA DEPENDIENDO LO QUE EL USUARIO QUIERE
function mostrarGrafica(tipo) {
    var ctx = document.getElementById('myChart').getContext('2d');

    // DESTRUIR GRAFICAS PARA QUE NO SE SATURE
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    var labels, data;
    if (tipo === 'temperature_2m_max') {
        labels = temperatureTrimestersLabels;
        data = averageTemperatures;
    } else if (tipo === 'temperature_2m_min') {
        labels = humidityTrimestersLabels;
        data = averageHumidity;
    } else if (tipo === 'temperature_2m_mean') {
        labels = pressureTrimestersLabels;
        data = averagePressure;
    }


    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: tipo === 'temperatura' ? 'Promedio de Temperatura por Trimestre' : tipo === 'humedad' ? 'Promedio de Humedad por Trimestre' : 'Promedio de Presión por Trimestre',
                data: data,
                backgroundColor: tipo === 'temperatura' ? 'rgba(255, 0, 0, 0.5)' : tipo === 'humedad' ? 'rgba(54, 162, 235, 0.5)' : 'rgba(255, 159, 64, 0.5)',
                borderColor: tipo === 'temperatura' ? 'rgba(255, 99, 132, 1)' : tipo === 'humedad' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            responsive: true,
            maintainAspectRatio: false,
            width: '100%',
            height: '100%',
            plugins: {
                legend: {
                    labels: {
                        color: 'rgb(255, 255, 255)',
                        fontSize: 30 // Tamaño de fuente para las leyendas
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: 'rgb(255, 255, 255)',
                        fontSize: 30 // Tamaño de fuente para el eje Y
                    }
                },
                x: {
                    ticks: {
                        color: 'rgb(255, 255, 255)',
                        fontSize: 30 // Tamaño de fuente para el eje X
                    }
                }
            }
        }
    });
    
   
}

// GRUPO POR TEMPERATURA
const temperatureTrimestersData = groupDataByTrimester(data);
// PROMEDIO POR TRIMESTRE TEMP
const averageTemperaturesByTrimester = calculateAverageByTrimester(temperatureTrimestersData);
// ETIQYETAS Y DATOS
const temperatureTrimestersLabels = Object.keys(averageTemperaturesByTrimester);
const averageTemperatures = Object.values(averageTemperaturesByTrimester);

// GRUPO POR HUMEDAD
const humidityTrimestersData = groupDataByTrimester(data);
// PROMEDIO POR TRIMESTRE HUM
const averageHumidityByTrimester = calculateAverageByTrimester(humidityTrimestersData);
// ETIQYETAS Y DATOS
const humidityTrimestersLabels = Object.keys(averageHumidityByTrimester);
const averageHumidity = Object.values(averageHumidityByTrimester);

// LO MISMO PERO CON PRESION
const pressureTrimestersData = groupDataByTrimester(data);

const averagePressureByTrimester = calculateAverageByTrimester(pressureTrimestersData);

const pressureTrimestersLabels = Object.keys(averagePressureByTrimester);
const averagePressure = Object.values(averagePressureByTrimester);

// Cambiar gráfico con listener
document.getElementById('tipoDatos').addEventListener('change', function () {
    var tipo = this.value; // Valor del select

    // MOSTRAR GRAFICA SELECCIONADA
    mostrarGrafica(tipo);
});

// Filtrar los datos de temperatura para el mes y año seleccionados
const temperaturesForMonth = data.filter(item => {
    const itemDate = new Date(item.time);
    return itemDate.getFullYear() === parseInt(anio) && itemDate.getMonth() + 1 === parseInt(mes); // Sumamos 1 al mes ya que getMonth() devuelve de 0 a 11
});

// Extraer las temperaturas y etiquetas para la gráfica
const temperatureLabels = temperaturesForMonth.map(item => new Date(item.time).getDate()); // Etiquetas: Días del mes
const temperatureValues = temperaturesForMonth.map(item => item.value); // Valores: Temperaturas

// Mostrar la gráfica de temperaturas del mes seleccionado
mostrarGrafica('temperatura', temperatureLabels, temperatureValues);
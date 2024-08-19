document.addEventListener('DOMContentLoaded', () => {
    const containerHaciaChile = document.getElementById('select-container-to-chile');
    const containerDesdeChile = document.getElementById('select-container-from-chile');
    const conversionToggle = document.getElementById('conversionToggle');
    const toChileForm = document.getElementById('toChile');
    const fromChileForm = document.getElementById('fromChile');

    const initialAmountForeignCurrency = document.getElementById('initialAmountForeignCurrency');
    const amountReceivedChile = document.getElementById('amountReceivedChile');
    const amountCLP = document.getElementById('amountCLP');
    const receivedForeignAmount = document.getElementById('receivedForeignAmount');
    
    const exchangeRateFromChile = document.getElementById('exchangeRateFromChile');
    const exchangeRateToChile = document.getElementById('exchangeRateToChile');

    const loadingPlaceholder = document.getElementById('loading-placeholder');
    const actualContent = document.getElementById('actual-content');

    let currencySelectedToChile = null;
    let currencySelectedFromChile = null;
    let incomingCountries = [];
    let sendCountries = []; 

    showLoadingSkeleton();

    initializeCountryData();

    conversionToggle.addEventListener('change', () => {
        resetFormValues();  
        toggleConversionMode();  
    });

    initialAmountForeignCurrency.addEventListener('input', () => {
        if (currencySelectedToChile && initialAmountForeignCurrency.value) {
            handleConversion(true, "toChile");  
        }
    });

    amountCLP.addEventListener('input', () => {
        if (currencySelectedFromChile && amountCLP.value) {
            handleConversion(true, "fromChile");  
        }
    });

    amountReceivedChile.addEventListener('input', () => {
        if (currencySelectedToChile && amountReceivedChile.value) {
            handleConversion(false, "fromChile");  
        }
    });

    receivedForeignAmount.addEventListener('input', () => {
        if (currencySelectedFromChile && receivedForeignAmount.value) {
            handleConversion(false, "toChile");  
        }
    });

    function initializeCountryData() {
        Promise.all([
            fetch('http://127.0.0.1:8000/divisas/incomingCountries')
                .then(response => response.json())
                .then(data => fetchCountryDetails(data).then(details => incomingCountries = details)),
            fetch('http://127.0.0.1:8000/divisas/sendCountries')
                .then(response => response.json())
                .then(data => fetchCountryDetails(data).then(details => sendCountries = details))
        ]).then(() => {
            setupCustomSelects();
            hideLoadingSkeleton();
        });
    }

    function setupCustomSelects() {

        const customSelectHaciaChile = createCustomSelect(incomingCountries, 'toChile');
        containerHaciaChile.appendChild(customSelectHaciaChile);

        const customSelectDesdeChile = createCustomSelect(sendCountries, 'fromChile');
        containerDesdeChile.appendChild(customSelectDesdeChile);
    }

    function toggleConversionMode() {
        if (conversionToggle.checked) {
            toChileForm.classList.add('hidden');
            toChileForm.classList.remove('active');
            fromChileForm.classList.add('active');
            fromChileForm.classList.remove('hidden');
    
            containerDesdeChile.innerHTML = ''; 
            const customSelectDesdeChile = createCustomSelect(sendCountries, 'fromChile');
            containerDesdeChile.appendChild(customSelectDesdeChile);
        } else {
            fromChileForm.classList.add('hidden');
            fromChileForm.classList.remove('active');
            toChileForm.classList.add('active');
            toChileForm.classList.remove('hidden');
    
            containerHaciaChile.innerHTML = ''; 
            const customSelectHaciaChile = createCustomSelect(incomingCountries, 'toChile');
            containerHaciaChile.appendChild(customSelectHaciaChile);
        }
    }
    

    function resetFormValues() {
        initialAmountForeignCurrency.value = '';
        amountReceivedChile.value = '';
        amountCLP.value = '';
        receivedForeignAmount.value = '';

        currencySelectedToChile = null;
        currencySelectedFromChile = null;
        const customSelectContainers = document.querySelectorAll('.custom-select-container');
        customSelectContainers.forEach(container => {
            const selected = container.querySelector('.custom-select-selected');
            if (selected) {
                selected.textContent = 'Select a country';
            }
        });

        exchangeRateFromChile.textContent = '';
        exchangeRateToChile.textContent = '';
    }

    function createCustomSelect(data, mode) {
        const container = document.createElement('div');
        container.classList.add('custom-select-container');

        const selected = document.createElement('div');
        selected.classList.add('custom-select-selected');
        selected.textContent = 'Select a country';
        container.appendChild(selected);

        const optionsList = document.createElement('div');
        optionsList.classList.add('custom-select-options');

        data.forEach(item => {
            if (item && item.currency) {
                const option = document.createElement('div');
                option.classList.add('custom-select-option');

                option.innerHTML = `
                    <img src="${item.flagUrl}" alt="${item.currency} flag" width="20" height="14" style="vertical-align:middle; margin-right:8px;">
                    ${item.countryName} (${item.currency})
                `;

                option.addEventListener('click', () => {
                    selected.innerHTML = option.innerHTML;

                    const currencySelected = option.innerText.split('(')[1].split(')')[0].trim();
                    if (mode === 'toChile') {
                        currencySelectedToChile = currencySelected;
                        if (initialAmountForeignCurrency.value) {
                            handleConversion(true, "toChile");
                        } else if (!initialAmountForeignCurrency.value && amountReceivedChile.value) {
                            handleConversion(false, "fromChile");
                        }
                    } else {
                        currencySelectedFromChile = currencySelected;
                        if (amountCLP.value) {
                            handleConversion(true, "fromChile");
                        } else if (!amountCLP.value && receivedForeignAmount.value) {
                            handleConversion(false, "toChile");
                        }
                    }

                    optionsList.classList.remove('active');
                });

                optionsList.appendChild(option);
            }
        });

        selected.addEventListener('click', (event) => {
            event.stopPropagation(); 
            optionsList.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            if (!container.contains(event.target)) {
                optionsList.classList.remove('active');
            }
        });

        container.appendChild(optionsList);
        return container;
    }

    function getFormatDate(date) {
        return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0');
    }

    function handleConversion(applyConversionFee, direction) {
        const dateFormatted = getFormatDate(new Date());
        let url, currency, amount, resultElement, exchangeRateElement;

        if (direction === "toChile") {
            if (applyConversionFee) {
                url = 'http://127.0.0.1:8000/convert_to_chile_with_fee';
            } else {
                url = 'http://127.0.0.1:8000/convert_to_chile_without_fee';
            }
            currency = applyConversionFee ? currencySelectedToChile : currencySelectedFromChile;
            amount = applyConversionFee ? initialAmountForeignCurrency.value : receivedForeignAmount.value;
            resultElement = applyConversionFee ? amountReceivedChile : amountCLP;
            exchangeRateElement = applyConversionFee ? exchangeRateToChile : exchangeRateFromChile;
            
        } else {
            if (applyConversionFee) {
                url = 'http://127.0.0.1:8000/convert_from_chile_with_fee';
            } else {
                url = 'http://127.0.0.1:8000/convert_from_chile_without_fee';
            }
            currency = applyConversionFee? currencySelectedFromChile : currencySelectedToChile;
            amount = applyConversionFee ? amountCLP.value : amountReceivedChile.value;
            resultElement = applyConversionFee ? receivedForeignAmount : initialAmountForeignCurrency;
            exchangeRateElement = applyConversionFee ? exchangeRateFromChile : exchangeRateToChile;
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "currency": currency,
                "amount": amount,
                "date": dateFormatted
            })
        })
        .then(response => response.json())
        .then(data => {
            resultElement.value = data["final_amount"];
            exchangeRateElement.textContent = `Tipo de Cambio: ${data["conversion_rate"]}`;
        });
    }

    function fetchCountryDetails(data) {
        const promises = data.map(item => {
            return getCountryNameAndFlag(item.isoCode).then(details => {
                if (details.name !== item.isoCode) {
                    return {
                        ...item,
                        countryName: details.name,
                        flagUrl: details.flag
                    };
                } else {
                    return null;
                }
            });
        });

        promises.push(Promise.resolve({
            currency: 'EUR',
            countryName: 'European Union',
            flagUrl: 'https://flagcdn.com/w320/eu.png'
        }));

        return Promise.all(promises).then(results => results.filter(item => item !== null));
    }

    function getCountryNameAndFlag(isoCode) {
        const excludedIsoCodes = ['YY', 'EU', 'XX', 'AC', 'KS'];

        if (excludedIsoCodes.includes(isoCode)) {
            return Promise.resolve({ name: isoCode, flag: '' });
        }
        return fetch(`https://restcountries.com/v3.1/alpha/${isoCode}`)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        console.warn(`Country not found for ISO code: ${isoCode}`);
                    }
                    return { name: isoCode, flag: '' };
                }
                return response.json();
            })
            .then(data => {
                if (data && data[0]) {
                    return {
                        name: data[0].name.common,
                        flag: data[0].flags.png 
                    };
                } else {
                    return { name: isoCode, flag: '' };
                }
            })
            .catch(error => {
                console.error('Error fetching country details:', error);
                return { name: isoCode, flag: '' };
            });
    }

    function showLoadingSkeleton() {
        loadingPlaceholder.style.display = 'block';
        actualContent.style.display = 'none';
    }

    function hideLoadingSkeleton() {
        loadingPlaceholder.style.display = 'none';
        actualContent.style.display = 'block';
    }
});

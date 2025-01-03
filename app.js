document.addEventListener("DOMContentLoaded", function () {
    const apiKey = '2ZJ0TNWF590K3FNW';  
    const indices = {
        'Dow Jones Futures': 'DJI',  
        'S&P 500': 'SPX',            
        'NASDAQ': 'IXIC',             
    };

    async function fetchIndexData(symbol) {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();

            console.log("Full API Response:", data); 
            if (data["Error Message"]) {
                console.error("API Error:", data["Error Message"]);
                return 'Error: ' + data["Error Message"]; 
            }

            if (data["Time Series (5min)"]) {
                const latestTime = Object.keys(data["Time Series (5min)"])[0];
                const latestData = data["Time Series (5min)"][latestTime];

                console.log("Latest Time:", latestTime);  
                console.log("Latest Data:", latestData);  

                return latestData["4. close"];
            } else {
                console.log("No time series data available for symbol:", symbol);
                return 'Data not available';  
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return 'Error fetching data'; 
        }
    }

    async function updateIndexValues() {
        for (const [index, symbol] of Object.entries(indices)) {
            const price = await fetchIndexData(symbol);
            const element = document.querySelector(`.index-para[data-index="${index}"]`);
            if (element) {
                element.textContent = price ? `$${price}` : "Data not available"; 
            }
        }
    }

    updateIndexValues(); 

    setInterval(updateIndexValues, 60000);
});


// stock search ka scene hai ye 



document.addEventListener("DOMContentLoaded", function () {
    const apiKey = 'KRwVDb4DgTEMMQYkwXAV4fYIXVeumcYo'; 


    async function fetchStockData(stockSymbol) {
        const stockUrl = `https://api.polygon.io/v3/reference/tickers/${stockSymbol}?apiKey=${apiKey}`;

        try {
            const response = await fetch(stockUrl);
            const data = await response.json();

            if (data.results) {
                const stock = data.results;

               
                const companyName = stock.name;
                const logoUrl = stock.logo_url;

                const priceUrl = `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/prev?apiKey=${apiKey}`;
                const priceResponse = await fetch(priceUrl);
                const priceData = await priceResponse.json();

                const lastPrice = priceData.results ? priceData.results[0].c : 'N/A'; 
                const marketCap = stock.market_cap || 'N/A';
                const week52Low = stock.week_52_low || 'N/A';
                const week52High = stock.week_52_high || 'N/A';
                const volume = priceData.results ? priceData.results[0].v : 'N/A'; 

                document.getElementById("viewit").innerHTML = `
                    <strong>${companyName}</strong><br>
                    <strong>Last Price: $${lastPrice}</strong><br>
                    <strong>Market Cap: $${marketCap}</strong><br>
                    <strong>52-Week Low: $${week52Low}</strong><br>
                    <strong>52-Week High: $${week52High}</strong><br>
                    <strong>Volume: ${volume}</strong><br>
                `;

                if (logoUrl) {
                    const logoImg = document.createElement("img");
                    logoImg.src = logoUrl;
                    logoImg.alt = `${companyName} Logo`;
                    logoImg.classList.add("stock-logo");
                    document.getElementById("viewit").appendChild(logoImg);
                } else {
                    console.log('No logo found for this stock');
                }
            } else {
                document.getElementById("viewit").textContent = "Stock not found.";
            }
        } catch (error) {
            console.error("Error fetching stock data:", error);
            document.getElementById("viewit").textContent = "Error fetching stock data.";
        }
    }

    function handleSearch() {
        const searchInput = document.getElementById("search-input").value.trim().toUpperCase();
        
        const menImage = document.getElementById("men-magnify");
        if (menImage) {
            menImage.remove();
        }

        if (searchInput) {
            fetchStockData(searchInput);
        } else {
            alert("Please enter a valid stock symbol.");
        }
    }

    document.getElementById("search-icon").addEventListener("click", handleSearch);
});


// gold silver ka scene hai 


 

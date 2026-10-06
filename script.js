const API_URL = "https://inai-col1.fishrungames.com/ads";

const adsList = document.getElementById("adsList");
const adForm = document.getElementById("adForm");
const message = document.getElementById("message");
const showAdsButton = document.getElementById("showAdsButton");



async function loadAds() {

    adsList.classList.remove("hidden");

    adsList.innerHTML = "<p>Загрузка объявлений...</p>";

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Ошибка сервера: " + response.status);
        }

        const data = await response.json();

        console.log("Объявления:", data);

        adsList.innerHTML = "";

        if (!data.items || data.items.length === 0) {
            adsList.innerHTML = "<p>Объявлений пока нет.</p>";
            return;
        }

        data.items.forEach(function(ad) {

            const card = document.createElement("div");

            card.className = "ad-card";

            let image = "";

            if (ad.image_url) {

                image =
                    '<img src="https://inai-col1.fishrungames.com' +
                    ad.image_url +
                    '" alt="Фото объявления">';

            }

            card.innerHTML =
                image +
                "<h3>" + ad.title + "</h3>" +
                "<p>" + ad.description + "</p>" +
                '<div class="price">' +
                Number(ad.price).toLocaleString("ru-RU") +
                " сом</div>";

            adsList.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        adsList.innerHTML =
            "<p>❌ Не удалось загрузить объявления.</p>";

    }
}




showAdsButton.addEventListener("click", function() {

    loadAds();

    showAdsButton.textContent = "🔄 Обновить объявления";

});




adForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    message.textContent = "Публикация объявления...";

    const title =
        document.getElementById("title").value;

    const description =
        document.getElementById("description").value;

    const price =
        document.getElementById("price").value;

    const imageInput =
        document.getElementById("image");


    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);


    if (imageInput.files.length > 0) {

        formData.append(
            "image",
            imageInput.files[0]
        );

    }


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            body: formData

        });


        if (!response.ok) {

            throw new Error(
                "Ошибка сервера: " + response.status
            );

        }


        const newAd = await response.json();

        console.log("Новое объявление:", newAd);


        message.textContent =
            "✅ Объявление успешно опубликовано!";


        adForm.reset();


        // Сразу показываем сохранённое объявление
        await loadAds();


    } catch (error) {

        console.error(error);

        message.textContent =
            "❌ Не удалось опубликовать объявление.";

    }

});
import { az, en, placeholder, ru } from "./assets"
import { projectFirestore } from "./firebase/config"

const services = [
    {
        title: "Menyu",
        choices: [
            {
                title: "Dəri menyular",
                pictures: projectFirestore
            },
            {
                title: "Kitab menyular",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Jurnal menyular",
                pictures: [placeholder, placeholder]
            },
            {
                title: "Karton menyular (A3/A4)",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Sadə laminasiyalı menyular",
                pictures: [placeholder, placeholder, placeholder]
            }
        ]
    },
    {
        title: "Hesab Qabı",
    },
    {
        title: "Ofset Çapı",
        choices: [
            {
                title: "Flauer",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Buklet",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Diklet",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Vizitka",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Qovluq",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Qaimə",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Kataloq",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Qutu",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Kağız çanta",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Bloknot",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Qeyd kağızı",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Firma blankı",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Dəvətnamə",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Stiker",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Poster",
                pictures: [placeholder, placeholder, placeholder]
            }

        ]
    },
    {
        title: "Tekstil Çapı",
        choices: [
            {
                title: "Köynək üzərinə çap",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Papaq üzərinə çap",
                pictures: [placeholder, placeholder, placeholder]
            },
            {
                title: "Fartuk üzərinə çap",
                pictures: [placeholder, placeholder, placeholder]
            }
        ]
    }
]

const languageTexts = {
    "az": {
        title:"AZ",
        header: "Azərbaycan dili",
        serviceBottom0: `Hesaba`,
        serviceBottom1: `servis haqqı əlavə olunur`,
        menuOperation: "Əsas menu",
        specialOffers: "Xüsusi təkliflər",
        reservation: "Rezervasya",
        searchPlace: "Məhsul axtar",
        hesabIste: "Hesab istə",
        makeOrder: "Sifariş ver",
        orders: "Sifarişləriniz",
        notes: "Qeydləriniz",
        allergy: "Allergiyam var",
        tableOrder: "Masanın nömrəsini düzgün seçin*",
        roomOrder: "Otağın nömrəsini düzgün seçin*",
        reset: "Sıfırla",
        confirmOrder: "Sifarişi təsdiqlə - Whatsapp",
        billOrder: "Sifarişiniz",
        tableNumber: "Masa nömrəsi",
        roomNumber: "Otaq nömrəsi",
        payMethod: "Ödəniş növü",
        billSum: "Cəmi",
        cancel: "Ləğv et",
        askBill: "Hesab istə",
        cash: "Nağd",
        card: "Kart",
        table:"Stol",
        room:"Otaq",
        allerg: "Allergiya",
        note:"Qeyd",
        servicefee:"Servis haqqı",
        img:az
    },
    "en": {
        title:"EN",
        header: "English",
        serviceBottom0: `A`,
        serviceBottom1: `service fee is added to the account`,
        menuOperation: "Main menu",
        specialOffers: "Special offers",
        reservation: "Reservation",
        searchPlace: "Search",
        hesabIste: "Ask for a bill",
        makeOrder: "Order",
        orders: "Your orders",
        notes: "Notes",
        allergy: "I have an allergy",
        tableOrder: "Choose the table number correctly*",
        roomOrder: "Choose the room number correctly*",
        reset: "Reset",
        confirmOrder: "Confirm order - Whatsapp",
        billOrder: "Your order",
        tableNumber: "Table number",
        roomNumber: "Room number",
        payMethod: "Payment method",
        billSum: "Total",
        cancel: "Cancel",
        askBill: "Ask for bill",
        cash: "Cash",
        card: "Card",
        table:"Table",
        room:"Room",
        allerg: "Allergy",
        note:"Note",
        servicefee:"Service fee",
        img:en
    },
    "ru": {
        title:"EN",
        header:"Русский",
        serviceBottom0: `A`,
        serviceBottom1: `service fee is added to the account`,
        menuOperation: "Main menu",
        specialOffers: "Special offers",
        reservation: "Reservation",
        searchPlace: "Search",
        hesabIste: "Ask for a bill",
        makeOrder: "Order",
        orders: "Your orders",
        notes: "Notes",
        allergy: "I have an allergy",
        tableOrder: "Choose the table number correctly*",
        roomOrder: "Choose the room number correctly*",
        reset: "Reset",
        confirmOrder: "Confirm order - Whatsapp",
        billOrder: "Your order",
        tableNumber: "Table number",
        roomNumber: "Room number",
        payMethod: "Payment method",
        billSum: "Total",
        cancel: "Cancel",
        askBill: "Ask for bill",
        cash: "Cash",
        card: "Card",
        table:"Table",
        room:"Room",
        allerg: "Allergy",
        note:"Note",
        servicefee:"Service fee",
        img:ru
    }
}

const categories = ["Ailəvi restoran", "Hotel", "Pub", "Bar", "Lounge", "Dönər evi", "Suşi restoranı", "Şirniyyat evi", "Kafe", "Şadlıq sarayı", "Digər"]

export { categories, services, languageTexts }
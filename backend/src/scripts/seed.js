import bcrypt from "bcrypt"
import { connectToDatabase, disconnectFromDatabase } from "../config/mongodb.js"
import User from "../models/user.js"
import Seller from "../models/seller.js"
import Offer from "../models/offer.js"
import { USER_ROLES, USER_STATUS } from "../constants/user.js"
import { SELLER_APPROVAL_STATUS } from "../constants/seller.js"
import { OFFER_CATEGORIES } from "../constants/offer.js"

const passwordHash = await bcrypt.hash("Test1234", 12)

const sellerData = [
  {
    firstName: "Milica",
    lastName: "Jovanović",
    email: "milica.seed@kuvam.rs",
    businessName: "Miličina domaća kuhinja",
    description: "Domaća kuvana jela, pite i kolači po porudžbini."
  },
  {
    firstName: "Dragan",
    lastName: "Petrović",
    email: "dragan.seed@kuvam.rs",
    businessName: "Ukusi Šumadije",
    description: "Tradicionalna jela, roštilj i domaće salate."
  },
  {
    firstName: "Jelena",
    lastName: "Nikolić",
    email: "jelena.seed@kuvam.rs",
    businessName: "Jelenina slatka radionica",
    description: "Torte, kolači, peciva i domaći deserti."
  },
  {
    firstName: "Marko",
    lastName: "Ilić",
    email: "marko.seed@kuvam.rs",
    businessName: "Iz bakinog špajza",
    description: "Zimnica, sokovi i domaći proizvodi."
  }
]

const offerData = [
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Domaća sarma",
    description: "Porcija domaće sarme sa pire krompirom.",
    category: OFFER_CATEGORIES.COOKED_MEALS,
    price: 720,
    availableQuantity: 12,
    unit: "porcija"
  },
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Punjene paprike",
    description: "Punjene paprike u domaćem paradajz sosu.",
    category: OFFER_CATEGORIES.COOKED_MEALS,
    price: 680,
    availableQuantity: 10,
    unit: "porcija"
  },
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Teleća čorba",
    description: "Gusta domaća teleća čorba sa povrćem.",
    category: OFFER_CATEGORIES.SOUPS_AND_STEWS,
    price: 390,
    availableQuantity: 15,
    unit: "porcija"
  },
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Gibanica sa sirom",
    description: "Domaća gibanica pripremljena sa svežim sirom.",
    category: OFFER_CATEGORIES.BAKERY_AND_PIES,
    price: 850,
    availableQuantity: 8,
    unit: "tepsija"
  },
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Projice sa sirom",
    description: "Mekane projice sa domaćim sirom.",
    category: OFFER_CATEGORIES.BREAKFAST_AND_SNACKS,
    price: 420,
    availableQuantity: 20,
    unit: "pakovanje"
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Mešano meso sa roštilja",
    description: "Ćevapi, kobasica, pileći file i svinjski vrat.",
    category: OFFER_CATEGORIES.GRILLED_AND_ROASTED,
    price: 1350,
    availableQuantity: 10,
    unit: "porcija"
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Pečena svinjetina",
    description: "Sporo pečena svinjetina sa domaćim krompirom.",
    category: OFFER_CATEGORIES.GRILLED_AND_ROASTED,
    price: 1100,
    availableQuantity: 9,
    unit: "porcija"
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Pasulj sa kobasicom",
    description: "Domaći pasulj sa dimljenom kobasicom.",
    category: OFFER_CATEGORIES.SOUPS_AND_STEWS,
    price: 620,
    availableQuantity: 14,
    unit: "porcija"
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Šopska salata",
    description: "Paradajz, krastavac, paprika, luk i domaći sir.",
    category: OFFER_CATEGORIES.SALADS_AND_SIDES,
    price: 360,
    availableQuantity: 18,
    unit: "porcija"
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Prebranac",
    description: "Zapečeni pasulj sa crnim lukom i začinima.",
    category: OFFER_CATEGORIES.SALADS_AND_SIDES,
    price: 450,
    availableQuantity: 12,
    unit: "porcija"
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Reforma torta",
    description: "Čokoladna torta sa orasima i bogatim filom.",
    category: OFFER_CATEGORIES.DESSERTS,
    price: 2800,
    availableQuantity: 4,
    unit: "torta"
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Vanilice",
    description: "Tradicionalne vanilice sa domaćim džemom.",
    category: OFFER_CATEGORIES.DESSERTS,
    price: 750,
    availableQuantity: 15,
    unit: "kilogram"
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Pita sa višnjama",
    description: "Hrskava pita sa višnjama i šećerom u prahu.",
    category: OFFER_CATEGORIES.BAKERY_AND_PIES,
    price: 950,
    availableQuantity: 7,
    unit: "tepsija"
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Domaće krofne",
    description: "Mekane krofne punjene kremom ili džemom.",
    category: OFFER_CATEGORIES.DESSERTS,
    price: 600,
    availableQuantity: 20,
    unit: "pakovanje"
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Slani štapići",
    description: "Domaći hrskavi štapići sa susamom.",
    category: OFFER_CATEGORIES.BREAKFAST_AND_SNACKS,
    price: 430,
    availableQuantity: 16,
    unit: "pakovanje"
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Domaći ajvar",
    description: "Blagi domaći ajvar od pečene crvene paprike.",
    category: OFFER_CATEGORIES.PRESERVED_FOOD,
    price: 780,
    availableQuantity: 25,
    unit: "tegla"
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Ljutenica",
    description: "Pikantna domaća ljutenica sa pečenom paprikom.",
    category: OFFER_CATEGORIES.PRESERVED_FOOD,
    price: 720,
    availableQuantity: 18,
    unit: "tegla"
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Kiseli krastavci",
    description: "Domaći hrskavi kiseli krastavci.",
    category: OFFER_CATEGORIES.PRESERVED_FOOD,
    price: 520,
    availableQuantity: 22,
    unit: "tegla"
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Sok od zove",
    description: "Domaći sirup od cveta zove.",
    category: OFFER_CATEGORIES.DRINKS,
    price: 650,
    availableQuantity: 20,
    unit: "litar"
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Sok od maline",
    description: "Gusti domaći sok od maline bez veštačkih dodataka.",
    category: OFFER_CATEGORIES.DRINKS,
    price: 800,
    availableQuantity: 16,
    unit: "litar"
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Domaći med",
    description: "Prirodni livadski med lokalnog porekla.",
    category: OFFER_CATEGORIES.OTHER,
    price: 1100,
    availableQuantity: 14,
    unit: "tegla"
  }
]

const seed = async () => {
  try {
    await connectToDatabase()

    const sellersByEmail = new Map()

    for (const data of sellerData) {
      const user = await User.findOneAndUpdate(
        { email: data.email },
        {
          $set: {
            firstName: data.firstName,
            lastName: data.lastName,
            passwordHash,
            role: USER_ROLES.SELLER,
            status: USER_STATUS.ACTIVE,
            reportsCount: 0,
            offences: 0,
            suspensionReason: null,
            banReason: null
          }
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      )

      const seller = await Seller.findOneAndUpdate(
        { user: user._id },
        {
          $set: {
            businessName: data.businessName,
            description: data.description,
            approvalStatus: SELLER_APPROVAL_STATUS.APPROVED,
            rejectionReason: null
          }
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      )

      sellersByEmail.set(data.email, seller)
    }

    const seededSellers = [...sellersByEmail.values()]

    await Offer.deleteMany({
      seller: {
        $in: seededSellers.map(seller => seller._id)
      }
    })

    const offers = offerData.map(data => ({
      seller: sellersByEmail.get(data.sellerEmail)._id,
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      availableQuantity: data.availableQuantity,
      unit: data.unit,
      imageUrl: null,
      isActive: true
    }))

    await Offer.insertMany(offers)

    console.log(`Seed completed: ${sellerData.length} sellers and ${offers.length} offers created.`)
    console.log("Seed seller password: Test1234")
  } catch (error) {
    console.error("Seed failed.")
    console.error(error)
    process.exitCode = 1
  } finally {
    await disconnectFromDatabase()
  }
}

await seed()
import bcrypt from "bcrypt"
import Notification from "../models/notification.js"
import env from "../config/env.js"
import {
  connectToDatabase,
  disconnectFromDatabase
} from "../config/mongodb.js"
import User from "../models/user.js"
import Seller from "../models/seller.js"
import Offer from "../models/offer.js"
import Order from "../models/order.js"
import Report from "../models/report.js"
import City from "../models/city.js"
import {
  USER_ROLES,
  USER_STATUS
} from "../constants/user.js"
import {
  SELLER_APPROVAL_STATUS
} from "../constants/seller.js"
import {
  OFFER_CATEGORIES
} from "../constants/offer.js"
import {
  ORDER_STATUS
} from "../constants/order.js"
import {
  REPORT_REASONS,
  REPORT_STATUS
} from "../constants/report.js"

const passwordHash = await bcrypt.hash("Test1234", 12)

const adminPasswordHash = await bcrypt.hash(env.adminPassword, 12)

const adminData = {
  firstName: env.adminFirstName,
  lastName: env.adminLastName,
  email: env.adminEmail
}

const cityData = [
  {
    name: "Beograd",
    slug: "beograd"
  },
  {
    name: "Novi Sad",
    slug: "novi-sad"
  },
  {
    name: "Niš",
    slug: "nis"
  },
  {
    name: "Kragujevac",
    slug: "kragujevac"
  },
  {
    name: "Čačak",
    slug: "cacak"
  },
  {
    name: "Kraljevo",
    slug: "kraljevo"
  }
]

const userData = [
  {
  firstName: "Jovana",
  lastName: "Popović",
  email: "jovana.deactivated@kuvam.rs",
  citySlug: "beograd",
  address: {
    street: "Kneza Miloša",
    streetNumber: "54",
    additionalInfo: null,
    latitude: 44.8019,
    longitude: 20.4592
  },
  status: USER_STATUS.DEACTIVATED,
  reportsCount: 0,
  offences: 0,
  suspensionReason: null,
  suspendedAt: null,
  banReason: null
},
  
  
  {
    firstName: "Nikola",
    lastName: "Simić",
    email: "nikola.seed@kuvam.rs",
    citySlug: "kragujevac",
    address: {
      street: "Kralja Aleksandra I Karađorđevića",
      streetNumber: "42",
      additionalInfo: "Stan 8, drugi sprat",
      latitude: 44.0157,
      longitude: 20.9116
    },
    status: USER_STATUS.ACTIVE,
    reportsCount: 0,
    offences: 0,
    suspensionReason: null,
    suspendedAt: null,
    banReason: null
  },
  {
    firstName: "Sofija",
    lastName: "Milošević",
    email: "sofija.seed@kuvam.rs",
    citySlug: "cacak",
    address: {
      street: "Gospodar Jovanova",
      streetNumber: "18",
      additionalInfo: null,
      latitude: 43.8917,
      longitude: 20.3492
    },
    status: USER_STATUS.ACTIVE,
    reportsCount: 0,
    offences: 0,
    suspensionReason: null,
    suspendedAt: null,
    banReason: null
  },
  {
    firstName: "Mina",
    lastName: "Lazić",
    email: "mina.nolocation@kuvam.rs",
    citySlug: null,
    address: {
      street: null,
      streetNumber: null,
      additionalInfo: null,
      latitude: null,
      longitude: null
    },
    status: USER_STATUS.ACTIVE,
    reportsCount: 0,
    offences: 0,
    suspensionReason: null,
    suspendedAt: null,
    banReason: null
  },
  {
    firstName: "Ana",
    lastName: "Marković",
    email: "ana.suspended@kuvam.rs",
    citySlug: "beograd",
    address: {
      street: "Bulevar kralja Aleksandra",
      streetNumber: "125",
      additionalInfo: null,
      latitude: 44.8028,
      longitude: 20.4858
    },
    status: USER_STATUS.SUSPENDED,
    reportsCount: 2,
    offences: 1,
    suspensionReason: "Višestruko neprimereno ponašanje prema prodavcima.",
    suspendedAt: new Date("2026-07-27T12:00:00.000Z"),
    banReason: null
  },
  {
    firstName: "Petar",
    lastName: "Đorđević",
    email: "petar.suspended@kuvam.rs",
    citySlug: "novi-sad",
    address: {
      street: "Futoška",
      streetNumber: "73",
      additionalInfo: null,
      latitude: 45.2495,
      longitude: 19.8248
    },
    status: USER_STATUS.SUSPENDED,
    reportsCount: 3,
    offences: 2,
    suspensionReason: "Zloupotreba sistema porudžbina i lažne rezervacije.",
    suspendedAt: new Date("2026-07-29T16:30:00.000Z"),
    banReason: null
  },
  {
    firstName: "Luka",
    lastName: "Stojanović",
    email: "luka.banned@kuvam.rs",
    citySlug: "nis",
    address: {
      street: "Vožda Karađorđa",
      streetNumber: "31",
      additionalInfo: null,
      latitude: 43.3218,
      longitude: 21.8981
    },
    status: USER_STATUS.BANNED,
    reportsCount: 4,
    offences: 3,
    suspensionReason: null,
    suspendedAt: null,
    banReason: "Nalog je banovan nakon više potvrđenih prekršaja."
  }
]

const sellerData = [
  {
    firstName: "Milica",
    lastName: "Jovanović",
    email: "milica.seed@kuvam.rs",
    businessName: "Miličina domaća kuhinja",
    slug: "milicina-domaca-kuhinja",
    description: "Domaća kuvana jela, pite i kolači po porudžbini.",
    citySlug: "kragujevac",
    pickupAddress: {
      street: "Svetozara Markovića",
      streetNumber: "27",
      additionalInfo: "Preuzimanje na ulazu iz dvorišta",
      latitude: 44.0109,
      longitude: 20.9176
    },
    approvalStatus: SELLER_APPROVAL_STATUS.APPROVED
  },
  {
    firstName: "Dragan",
    lastName: "Petrović",
    email: "dragan.seed@kuvam.rs",
    businessName: "Ukusi Šumadije",
    slug: "ukusi-sumadije",
    description: "Tradicionalna jela, roštilj i domaće salate.",
    citySlug: "kragujevac",
    pickupAddress: {
      street: "Kneza Miloša",
      streetNumber: "64",
      additionalInfo: "Preuzimanje na kapiji",
      latitude: 44.0134,
      longitude: 20.9078
    },
    approvalStatus: SELLER_APPROVAL_STATUS.APPROVED
  },
  {
    firstName: "Jelena",
    lastName: "Nikolić",
    email: "jelena.seed@kuvam.rs",
    businessName: "Jelenina slatka radionica",
    slug: "jelenina-slatka-radionica",
    description: "Torte, kolači, peciva i domaći deserti.",
    citySlug: "cacak",
    pickupAddress: {
      street: "Župana Stracimira",
      streetNumber: "15",
      additionalInfo: "Lokal u prizemlju",
      latitude: 43.8914,
      longitude: 20.3497
    },
    approvalStatus: SELLER_APPROVAL_STATUS.APPROVED
  },
  {
    firstName: "Marko",
    lastName: "Ilić",
    email: "marko.seed@kuvam.rs",
    businessName: "Iz bakinog špajza",
    slug: "iz-bakinog-spajza",
    description: "Zimnica, sokovi i domaći proizvodi.",
    citySlug: "cacak",
    pickupAddress: {
      street: "Bate Jankovića",
      streetNumber: "39",
      additionalInfo: null,
      latitude: 43.8865,
      longitude: 20.3564
    },
    approvalStatus: SELLER_APPROVAL_STATUS.APPROVED
  },
  {
    firstName: "Vesna",
    lastName: "Pavlović",
    email: "vesna.seed@kuvam.rs",
    businessName: "Vesnina trpeza",
    slug: "vesnina-trpeza",
    description: "Domaća jela pripremljena po tradicionalnim porodičnim receptima.",
    citySlug: "kraljevo",
    pickupAddress: {
      street: "Omladinska",
      streetNumber: "21",
      additionalInfo: "Pozvati po dolasku",
      latitude: 43.7243,
      longitude: 20.6879
    },
    approvalStatus: SELLER_APPROVAL_STATUS.APPROVED
  },
  {
    firstName: "Marija",
    lastName: "Ristić",
    email: "marija.pending@kuvam.rs",
    businessName: "Marijini domaći ukusi",
    slug: "marijini-domaci-ukusi",
    description: "Domaća peciva i kuvana jela.",
    citySlug: "kragujevac",
    pickupAddress: {
      street: "Zmaj Jovina",
      streetNumber: "11",
      additionalInfo: null,
      latitude: 44.012,
      longitude: 20.9115
    },
    approvalStatus: SELLER_APPROVAL_STATUS.PENDING
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
    unit: "porcija",
    isActive: true
  },
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Punjene paprike",
    description: "Punjene paprike u domaćem paradajz sosu.",
    category: OFFER_CATEGORIES.COOKED_MEALS,
    price: 680,
    availableQuantity: 10,
    unit: "porcija",
    isActive: true
  },
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Teleća čorba",
    description: "Gusta domaća teleća čorba sa povrćem.",
    category: OFFER_CATEGORIES.SOUPS_AND_STEWS,
    price: 390,
    availableQuantity: 15,
    unit: "porcija",
    isActive: true
  },
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Gibanica sa sirom",
    description: "Domaća gibanica pripremljena sa svežim sirom.",
    category: OFFER_CATEGORIES.BAKERY_AND_PIES,
    price: 850,
    availableQuantity: 8,
    unit: "tepsija",
    isActive: true
  },
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Projice sa sirom",
    description: "Mekane projice sa domaćim sirom.",
    category: OFFER_CATEGORIES.BREAKFAST_AND_SNACKS,
    price: 420,
    availableQuantity: 20,
    unit: "pakovanje",
    isActive: true
  },
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Rasprodata musaka",
    description: "Domaća musaka sa krompirom i mlevenim mesom.",
    category: OFFER_CATEGORIES.COOKED_MEALS,
    price: 650,
    availableQuantity: 0,
    unit: "porcija",
    isActive: true
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Mešano meso sa roštilja",
    description: "Ćevapi, kobasica, pileći file i svinjski vrat.",
    category: OFFER_CATEGORIES.GRILLED_AND_ROASTED,
    price: 1350,
    availableQuantity: 10,
    unit: "porcija",
    isActive: true
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Pečena svinjetina",
    description: "Sporo pečena svinjetina sa domaćim krompirom.",
    category: OFFER_CATEGORIES.GRILLED_AND_ROASTED,
    price: 1100,
    availableQuantity: 9,
    unit: "porcija",
    isActive: true
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Pasulj sa kobasicom",
    description: "Domaći pasulj sa dimljenom kobasicom.",
    category: OFFER_CATEGORIES.SOUPS_AND_STEWS,
    price: 620,
    availableQuantity: 14,
    unit: "porcija",
    isActive: true
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Šopska salata",
    description: "Paradajz, krastavac, paprika, luk i domaći sir.",
    category: OFFER_CATEGORIES.SALADS_AND_SIDES,
    price: 360,
    availableQuantity: 18,
    unit: "porcija",
    isActive: true
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Prebranac",
    description: "Zapečeni pasulj sa crnim lukom i začinima.",
    category: OFFER_CATEGORIES.SALADS_AND_SIDES,
    price: 450,
    availableQuantity: 12,
    unit: "porcija",
    isActive: true
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Reforma torta",
    description: "Čokoladna torta sa orasima i bogatim filom.",
    category: OFFER_CATEGORIES.DESSERTS,
    price: 2800,
    availableQuantity: 4,
    unit: "torta",
    isActive: true
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Vanilice",
    description: "Tradicionalne vanilice sa domaćim džemom.",
    category: OFFER_CATEGORIES.DESSERTS,
    price: 750,
    availableQuantity: 15,
    unit: "kilogram",
    isActive: true
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Pita sa višnjama",
    description: "Hrskava pita sa višnjama i šećerom u prahu.",
    category: OFFER_CATEGORIES.BAKERY_AND_PIES,
    price: 950,
    availableQuantity: 7,
    unit: "tepsija",
    isActive: true
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Domaće krofne",
    description: "Mekane krofne punjene kremom ili džemom.",
    category: OFFER_CATEGORIES.DESSERTS,
    price: 600,
    availableQuantity: 20,
    unit: "pakovanje",
    isActive: true
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Slani štapići",
    description: "Domaći hrskavi štapići sa susamom.",
    category: OFFER_CATEGORIES.BREAKFAST_AND_SNACKS,
    price: 430,
    availableQuantity: 16,
    unit: "pakovanje",
    isActive: true
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Domaći ajvar",
    description: "Blagi domaći ajvar od pečene crvene paprike.",
    category: OFFER_CATEGORIES.PRESERVED_FOOD,
    price: 780,
    availableQuantity: 25,
    unit: "tegla",
    isActive: true
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Ljutenica",
    description: "Pikantna domaća ljutenica sa pečenom paprikom.",
    category: OFFER_CATEGORIES.PRESERVED_FOOD,
    price: 720,
    availableQuantity: 18,
    unit: "tegla",
    isActive: true
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Kiseli krastavci",
    description: "Domaći hrskavi kiseli krastavci.",
    category: OFFER_CATEGORIES.PRESERVED_FOOD,
    price: 520,
    availableQuantity: 22,
    unit: "tegla",
    isActive: true
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Sok od zove",
    description: "Domaći sirup od cveta zove.",
    category: OFFER_CATEGORIES.DRINKS,
    price: 650,
    availableQuantity: 20,
    unit: "litar",
    isActive: true
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Sok od maline",
    description: "Gusti domaći sok od maline bez veštačkih dodataka.",
    category: OFFER_CATEGORIES.DRINKS,
    price: 800,
    availableQuantity: 16,
    unit: "litar",
    isActive: true
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Domaći med",
    description: "Prirodni livadski med lokalnog porekla.",
    category: OFFER_CATEGORIES.OTHER,
    price: 1100,
    availableQuantity: 14,
    unit: "tegla",
    isActive: true
  },
  {
    sellerEmail: "vesna.seed@kuvam.rs",
    name: "Juneći gulaš",
    description: "Sporo kuvani juneći gulaš sa domaćim začinima.",
    category: OFFER_CATEGORIES.COOKED_MEALS,
    price: 790,
    availableQuantity: 11,
    unit: "porcija",
    isActive: true
  },
  {
    sellerEmail: "vesna.seed@kuvam.rs",
    name: "Domaća supa",
    description: "Bistra pileća supa sa domaćim rezancima.",
    category: OFFER_CATEGORIES.SOUPS_AND_STEWS,
    price: 320,
    availableQuantity: 16,
    unit: "porcija",
    isActive: true
  },
  {
    sellerEmail: "vesna.seed@kuvam.rs",
    name: "Pita sa krompirom",
    description: "Domaća pita sa krompirom i tankim korama.",
    category: OFFER_CATEGORIES.BAKERY_AND_PIES,
    price: 820,
    availableQuantity: 6,
    unit: "tepsija",
    isActive: true
  },
  {
    sellerEmail: "vesna.seed@kuvam.rs",
    name: "Domaći kompot",
    description: "Kompot od sezonskog voća.",
    category: OFFER_CATEGORIES.DRINKS,
    price: 480,
    availableQuantity: 10,
    unit: "tegla",
    isActive: false
  },
  {
    sellerEmail: "marija.pending@kuvam.rs",
    name: "Domaća pita sa sirom",
    description: "Pita sa domaćim sirom i ručno razvijenim korama.",
    category: OFFER_CATEGORIES.BAKERY_AND_PIES,
    price: 900,
    availableQuantity: 7,
    unit: "tepsija",
    isActive: true
  }
]

const reportData = [
  {
    reporterEmail: "nikola.seed@kuvam.rs",
    reportedUserEmail: "milica.seed@kuvam.rs",
    sellerEmail: "milica.seed@kuvam.rs",
    buyerEmail: "nikola.seed@kuvam.rs",
    offerName: "Domaća sarma",
    quantity: 2,
    reason: REPORT_REASONS.FOOD_QUALITY_OR_SAFETY,
    description: "Hrana je stigla u lošem stanju i nije delovala bezbedno za konzumaciju.",
    status: REPORT_STATUS.PENDING,
    adminNote: null,
    createdAt: new Date("2026-07-29T18:30:00.000Z")
  },
  {
    reporterEmail: "sofija.seed@kuvam.rs",
    reportedUserEmail: "dragan.seed@kuvam.rs",
    sellerEmail: "dragan.seed@kuvam.rs",
    buyerEmail: "sofija.seed@kuvam.rs",
    offerName: "Mešano meso sa roštilja",
    quantity: 1,
    reason: REPORT_REASONS.MISLEADING_INFORMATION,
    description: "Dobijena porcija se značajno razlikovala od opisa i prikazane ponude.",
    status: REPORT_STATUS.PENDING,
    adminNote: null,
    createdAt: new Date("2026-07-30T08:15:00.000Z")
  },
  {
    reporterEmail: "milica.seed@kuvam.rs",
    reportedUserEmail: "nikola.seed@kuvam.rs",
    sellerEmail: "milica.seed@kuvam.rs",
    buyerEmail: "nikola.seed@kuvam.rs",
    offerName: "Punjene paprike",
    quantity: 3,
    reason: REPORT_REASONS.NO_SHOW,
    description: "Kupac se nije pojavio u dogovoreno vreme i nije odgovarao na poruke.",
    status: REPORT_STATUS.PENDING,
    adminNote: null,
    createdAt: new Date("2026-07-28T15:45:00.000Z")
  },
  {
    reporterEmail: "nikola.seed@kuvam.rs",
    reportedUserEmail: "jelena.seed@kuvam.rs",
    sellerEmail: "jelena.seed@kuvam.rs",
    buyerEmail: "nikola.seed@kuvam.rs",
    offerName: "Reforma torta",
    quantity: 1,
    reason: REPORT_REASONS.INAPPROPRIATE_BEHAVIOR,
    description: "Prodavac je tokom komunikacije koristio uvredljiv i neprimeren način obraćanja.",
    status: REPORT_STATUS.APPROVED,
    adminNote: "Prijava je potvrđena na osnovu dostavljenih informacija.",
    createdAt: new Date("2026-07-26T12:20:00.000Z")
  },
  {
    reporterEmail: "dragan.seed@kuvam.rs",
    reportedUserEmail: "sofija.seed@kuvam.rs",
    sellerEmail: "dragan.seed@kuvam.rs",
    buyerEmail: "sofija.seed@kuvam.rs",
    offerName: "Pasulj sa kobasicom",
    quantity: 2,
    reason: REPORT_REASONS.INAPPROPRIATE_BEHAVIOR,
    description: "Kupac je prilikom preuzimanja vređao prodavca i druge prisutne osobe.",
    status: REPORT_STATUS.APPROVED,
    adminNote: "Opis događaja je potvrđen i prijava je odobrena.",
    createdAt: new Date("2026-07-25T10:00:00.000Z")
  },
  {
    reporterEmail: "sofija.seed@kuvam.rs",
    reportedUserEmail: "marko.seed@kuvam.rs",
    sellerEmail: "marko.seed@kuvam.rs",
    buyerEmail: "sofija.seed@kuvam.rs",
    offerName: "Domaći ajvar",
    quantity: 2,
    reason: REPORT_REASONS.PAYMENT_ISSUE,
    description: "Kupac je prijavio problem sa iznosom, ali podaci porudžbine potvrđuju ispravnu cenu.",
    status: REPORT_STATUS.REJECTED,
    adminNote: "Nisu pronađene nepravilnosti u ceni ili obračunu porudžbine.",
    createdAt: new Date("2026-07-24T14:10:00.000Z")
  }
]

const getRequiredMapValue = (map, key, entityName) => {
  const value = map.get(key)

  if (!value) {
    throw new Error(`${entityName} not found for key: ${key}.`)
  }

  return value
}

const seed = async () => {
  try {
    await connectToDatabase()

    await Notification.deleteMany({})
    await Report.deleteMany({})
    await Order.deleteMany({})
    await Offer.deleteMany({})
    await Seller.deleteMany({})
    await User.deleteMany({})
    await City.deleteMany({})

    const createdCities = await City.insertMany(
      cityData.map(city => ({
        name: city.name,
        slug: city.slug,
        isActive: true
      }))
    )

    const citiesBySlug = new Map(
      createdCities.map(city => [
        city.slug,
        city
      ])
    )

    const admin = await User.create({
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
      passwordHash: adminPasswordHash,
      role: USER_ROLES.ADMIN,
      status: USER_STATUS.ACTIVE,
      city: null,
      address: {
        street: null,
        streetNumber: null,
        additionalInfo: null,
        latitude: null,
        longitude: null
      },
      reportsCount: 0,
      offences: 0,
      suspensionReason: null,
      suspendedAt: null,
      banReason: null
    })

    const usersByEmail = new Map()

    usersByEmail.set(admin.email, admin)

    for (const data of userData) {
      const city = data.citySlug
        ? getRequiredMapValue(
            citiesBySlug,
            data.citySlug,
            "City"
          )
        : null

      const user = await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash,
        role: USER_ROLES.BUYER,
        status: data.status,
        city: city?._id ?? null,
        address: data.address,
        reportsCount: data.reportsCount,
        offences: data.offences,
        suspensionReason: data.suspensionReason,
        suspendedAt: data.suspendedAt,
        banReason: data.banReason
      })

      usersByEmail.set(data.email, user)
    }

    const sellersByEmail = new Map()

    for (const data of sellerData) {
      const city = getRequiredMapValue(
        citiesBySlug,
        data.citySlug,
        "City"
      )

      const user = await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash,
        role: USER_ROLES.SELLER,
        status: USER_STATUS.ACTIVE,
        city: null,
        address: {
          street: null,
          streetNumber: null,
          additionalInfo: null,
          latitude: null,
          longitude: null
        },
        reportsCount: 0,
        offences: 0,
        suspensionReason: null,
        suspendedAt: null,
        banReason: null
      })

      usersByEmail.set(data.email, user)

      const seller = await Seller.create({
        user: user._id,
        businessName: data.businessName,
        slug: data.slug,
        description: data.description,
        profileImageUrl: null,
        coverImageUrl: null,
        city: city._id,
        pickupAddress: data.pickupAddress,
        approvalStatus: data.approvalStatus,
        rejectionReason: null
      })

      sellersByEmail.set(data.email, seller)
    }

    const offers = offerData.map(data => {
      const seller = getRequiredMapValue(
        sellersByEmail,
        data.sellerEmail,
        "Seller"
      )

      return {
        seller: seller._id,
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        availableQuantity: data.availableQuantity,
        unit: data.unit,
        imageUrl: null,
        isActive: data.isActive
      }
    })

    const createdOffers = await Offer.insertMany(
      offers
    )

    const offersByName = new Map(
      createdOffers.map(offer => [
        offer.name,
        offer
      ])
    )

    for (const data of reportData) {
      const reporter = getRequiredMapValue(
        usersByEmail,
        data.reporterEmail,
        "Reporter"
      )

      const reportedUser = getRequiredMapValue(
        usersByEmail,
        data.reportedUserEmail,
        "Reported user"
      )

      const buyer = getRequiredMapValue(
        usersByEmail,
        data.buyerEmail,
        "Buyer"
      )

      const seller = getRequiredMapValue(
        sellersByEmail,
        data.sellerEmail,
        "Seller"
      )

      const offer = getRequiredMapValue(
        offersByName,
        data.offerName,
        "Offer"
      )

      const itemTotalPrice =
        offer.price * data.quantity

      const order = await Order.create({
        buyer: buyer._id,
        seller: seller._id,
        items: [
          {
            offer: offer._id,
            name: offer.name,
            category: offer.category,
            imageUrl: offer.imageUrl,
            quantity: data.quantity,
            unit: offer.unit,
            unitPrice: offer.price,
            totalPrice: itemTotalPrice
          }
        ],
        totalPrice: itemTotalPrice,
        status: ORDER_STATUS.COMPLETED,
        buyerNote: "",
        rejectionReason: null,
        buyerOnTheWayAt: null,
        pickupCodeGeneratedAt: null,
        pickupCodeAttempts: 0,
        pickupCodeBlockedUntil: null,
        createdAt: data.createdAt,
        updatedAt: data.createdAt
      })

      const isReviewed =
        data.status !== REPORT_STATUS.PENDING

      await Report.create({
        reporter: reporter._id,
        reportedUser: reportedUser._id,
        order: order._id,
        reason: data.reason,
        description: data.description,
        status: data.status,
        reviewedBy: isReviewed
          ? admin._id
          : null,
        adminNote: isReviewed
          ? data.adminNote
          : null,
        reviewedAt: isReviewed
          ? data.createdAt
          : null,
        createdAt: data.createdAt,
        updatedAt: data.createdAt
      })
    }

    await User.updateMany(
      {},
      {
        $set: {
          reportsCount: 0,
          offences: 0
        }
      }
    )

    const reportCounts = await Report.aggregate([
      {
        $group: {
          _id: "$reportedUser",
          reportsCount: {
            $sum: 1
          },
          offences: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$status",
                    REPORT_STATUS.APPROVED
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ])

    for (const result of reportCounts) {
      await User.findByIdAndUpdate(
        result._id,
        {
          $set: {
            reportsCount:
              result.reportsCount,
            offences: result.offences
          }
        }
      )
    }

    const citiesCount =
      await City.countDocuments()

    const usersCount =
      await User.countDocuments()

    const sellersCount =
      await Seller.countDocuments()

    const approvedSellersCount =
      await Seller.countDocuments({
        approvalStatus:
          SELLER_APPROVAL_STATUS.APPROVED
      })

    const offersCount =
      await Offer.countDocuments()

    const publicOffersCount =
      await Offer.countDocuments({
        isActive: true,
        availableQuantity: {
          $gt: 0
        }
      })

    const ordersCount =
      await Order.countDocuments()

    const reportsCount =
      await Report.countDocuments()

    const pendingReportsCount =
      await Report.countDocuments({
        status: REPORT_STATUS.PENDING
      })

    const suspendedUsers = await User.find({
      status: USER_STATUS.SUSPENDED
    })
      .select(
        "firstName lastName email suspendedAt"
      )
      .lean()

    console.log(
      `Cities seeded: ${citiesCount}.`
    )

    console.log(
      `Users seeded: ${usersCount}.`
    )

    console.log(
      `Sellers seeded: ${sellersCount}, approved: ${approvedSellersCount}.`
    )

    console.log(
      `Offers seeded: ${offersCount}, active and available: ${publicOffersCount}.`
    )

    console.log(
      `Orders created: ${ordersCount}.`
    )

    console.log(
      `Reports created: ${reportsCount}, pending: ${pendingReportsCount}.`
    )

    console.log(
      `Suspended users created: ${suspendedUsers.length}.`
    )

    console.log(suspendedUsers)
    console.log("Seed user password: Test1234")
    console.log(
      `Seed admin email: ${env.adminEmail}`
    )
  } catch (error) {
    console.error("Seed failed.")
    console.error(error)
    process.exitCode = 1
  } finally {
    await disconnectFromDatabase()
  }
}

await seed()
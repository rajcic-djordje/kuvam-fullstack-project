import bcrypt from "bcrypt"
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

const adminPasswordHash = await bcrypt.hash(
  env.adminPassword,
  12
)

const adminData = {
  firstName: env.adminFirstName,
  lastName: env.adminLastName,
  email: env.adminEmail
}

const userData = [
  {
    firstName: "Nikola",
    lastName: "Simić",
    email: "nikola.seed@kuvam.rs",
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
    status: USER_STATUS.SUSPENDED,
    reportsCount: 2,
    offences: 1,
    suspensionReason:
      "Višestruko neprimereno ponašanje prema prodavcima.",
    suspendedAt: new Date("2026-07-27T12:00:00.000Z"),
    banReason: null
  },
  {
    firstName: "Petar",
    lastName: "Đorđević",
    email: "petar.suspended@kuvam.rs",
    status: USER_STATUS.SUSPENDED,
    reportsCount: 3,
    offences: 2,
    suspensionReason:
      "Zloupotreba sistema porudžbina i lažne rezervacije.",
    suspendedAt: new Date("2026-07-29T16:30:00.000Z"),
    banReason: null
  },
  {
    firstName: "Luka",
    lastName: "Stojanović",
    email: "luka.banned@kuvam.rs",
    status: USER_STATUS.BANNED,
    reportsCount: 4,
    offences: 3,
    suspensionReason: null,
    suspendedAt: null,
    banReason:
      "Nalog je banovan nakon više potvrđenih prekršaja."
  }
]

const sellerData = [
  {
    firstName: "Milica",
    lastName: "Jovanović",
    email: "milica.seed@kuvam.rs",
    businessName: "Miličina domaća kuhinja",
    description:
      "Domaća kuvana jela, pite i kolači po porudžbini."
  },
  {
    firstName: "Dragan",
    lastName: "Petrović",
    email: "dragan.seed@kuvam.rs",
    businessName: "Ukusi Šumadije",
    description:
      "Tradicionalna jela, roštilj i domaće salate."
  },
  {
    firstName: "Jelena",
    lastName: "Nikolić",
    email: "jelena.seed@kuvam.rs",
    businessName: "Jelenina slatka radionica",
    description:
      "Torte, kolači, peciva i domaći deserti."
  },
  {
    firstName: "Marko",
    lastName: "Ilić",
    email: "marko.seed@kuvam.rs",
    businessName: "Iz bakinog špajza",
    description:
      "Zimnica, sokovi i domaći proizvodi."
  }
]

const offerData = [
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Domaća sarma",
    description:
      "Porcija domaće sarme sa pire krompirom.",
    category: OFFER_CATEGORIES.COOKED_MEALS,
    price: 720,
    availableQuantity: 12,
    unit: "porcija"
  },
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Punjene paprike",
    description:
      "Punjene paprike u domaćem paradajz sosu.",
    category: OFFER_CATEGORIES.COOKED_MEALS,
    price: 680,
    availableQuantity: 10,
    unit: "porcija"
  },
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Teleća čorba",
    description:
      "Gusta domaća teleća čorba sa povrćem.",
    category: OFFER_CATEGORIES.SOUPS_AND_STEWS,
    price: 390,
    availableQuantity: 15,
    unit: "porcija"
  },
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Gibanica sa sirom",
    description:
      "Domaća gibanica pripremljena sa svežim sirom.",
    category: OFFER_CATEGORIES.BAKERY_AND_PIES,
    price: 850,
    availableQuantity: 8,
    unit: "tepsija"
  },
  {
    sellerEmail: "milica.seed@kuvam.rs",
    name: "Projice sa sirom",
    description:
      "Mekane projice sa domaćim sirom.",
    category: OFFER_CATEGORIES.BREAKFAST_AND_SNACKS,
    price: 420,
    availableQuantity: 20,
    unit: "pakovanje"
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Mešano meso sa roštilja",
    description:
      "Ćevapi, kobasica, pileći file i svinjski vrat.",
    category: OFFER_CATEGORIES.GRILLED_AND_ROASTED,
    price: 1350,
    availableQuantity: 10,
    unit: "porcija"
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Pečena svinjetina",
    description:
      "Sporo pečena svinjetina sa domaćim krompirom.",
    category: OFFER_CATEGORIES.GRILLED_AND_ROASTED,
    price: 1100,
    availableQuantity: 9,
    unit: "porcija"
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Pasulj sa kobasicom",
    description:
      "Domaći pasulj sa dimljenom kobasicom.",
    category: OFFER_CATEGORIES.SOUPS_AND_STEWS,
    price: 620,
    availableQuantity: 14,
    unit: "porcija"
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Šopska salata",
    description:
      "Paradajz, krastavac, paprika, luk i domaći sir.",
    category: OFFER_CATEGORIES.SALADS_AND_SIDES,
    price: 360,
    availableQuantity: 18,
    unit: "porcija"
  },
  {
    sellerEmail: "dragan.seed@kuvam.rs",
    name: "Prebranac",
    description:
      "Zapečeni pasulj sa crnim lukom i začinima.",
    category: OFFER_CATEGORIES.SALADS_AND_SIDES,
    price: 450,
    availableQuantity: 12,
    unit: "porcija"
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Reforma torta",
    description:
      "Čokoladna torta sa orasima i bogatim filom.",
    category: OFFER_CATEGORIES.DESSERTS,
    price: 2800,
    availableQuantity: 4,
    unit: "torta"
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Vanilice",
    description:
      "Tradicionalne vanilice sa domaćim džemom.",
    category: OFFER_CATEGORIES.DESSERTS,
    price: 750,
    availableQuantity: 15,
    unit: "kilogram"
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Pita sa višnjama",
    description:
      "Hrskava pita sa višnjama i šećerom u prahu.",
    category: OFFER_CATEGORIES.BAKERY_AND_PIES,
    price: 950,
    availableQuantity: 7,
    unit: "tepsija"
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Domaće krofne",
    description:
      "Mekane krofne punjene kremom ili džemom.",
    category: OFFER_CATEGORIES.DESSERTS,
    price: 600,
    availableQuantity: 20,
    unit: "pakovanje"
  },
  {
    sellerEmail: "jelena.seed@kuvam.rs",
    name: "Slani štapići",
    description:
      "Domaći hrskavi štapići sa susamom.",
    category: OFFER_CATEGORIES.BREAKFAST_AND_SNACKS,
    price: 430,
    availableQuantity: 16,
    unit: "pakovanje"
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Domaći ajvar",
    description:
      "Blagi domaći ajvar od pečene crvene paprike.",
    category: OFFER_CATEGORIES.PRESERVED_FOOD,
    price: 780,
    availableQuantity: 25,
    unit: "tegla"
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Ljutenica",
    description:
      "Pikantna domaća ljutenica sa pečenom paprikom.",
    category: OFFER_CATEGORIES.PRESERVED_FOOD,
    price: 720,
    availableQuantity: 18,
    unit: "tegla"
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Kiseli krastavci",
    description:
      "Domaći hrskavi kiseli krastavci.",
    category: OFFER_CATEGORIES.PRESERVED_FOOD,
    price: 520,
    availableQuantity: 22,
    unit: "tegla"
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Sok od zove",
    description:
      "Domaći sirup od cveta zove.",
    category: OFFER_CATEGORIES.DRINKS,
    price: 650,
    availableQuantity: 20,
    unit: "litar"
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Sok od maline",
    description:
      "Gusti domaći sok od maline bez veštačkih dodataka.",
    category: OFFER_CATEGORIES.DRINKS,
    price: 800,
    availableQuantity: 16,
    unit: "litar"
  },
  {
    sellerEmail: "marko.seed@kuvam.rs",
    name: "Domaći med",
    description:
      "Prirodni livadski med lokalnog porekla.",
    category: OFFER_CATEGORIES.OTHER,
    price: 1100,
    availableQuantity: 14,
    unit: "tegla"
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
    description:
      "Hrana je stigla u lošem stanju i nije delovala bezbedno za konzumaciju.",
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
    description:
      "Dobijena porcija se značajno razlikovala od opisa i prikazane ponude.",
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
    description:
      "Kupac se nije pojavio u dogovoreno vreme i nije odgovarao na poruke.",
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
    description:
      "Prodavac je tokom komunikacije koristio uvredljiv i neprimeren način obraćanja.",
    status: REPORT_STATUS.APPROVED,
    adminNote:
      "Prijava je potvrđena na osnovu dostavljenih informacija.",
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
    description:
      "Kupac je prilikom preuzimanja vređao prodavca i druge prisutne osobe.",
    status: REPORT_STATUS.APPROVED,
    adminNote:
      "Opis događaja je potvrđen i prijava je odobrena.",
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
    description:
      "Kupac je prijavio problem sa iznosom, ali podaci porudžbine potvrđuju ispravnu cenu.",
    status: REPORT_STATUS.REJECTED,
    adminNote:
      "Nisu pronađene nepravilnosti u ceni ili obračunu porudžbine.",
    createdAt: new Date("2026-07-24T14:10:00.000Z")
  }
]

const seed = async () => {
  try {
    await connectToDatabase()

    const admin = await User.findOneAndUpdate(
      {
        email: adminData.email
      },
      {
        $set: {
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          passwordHash: adminPasswordHash,
          role: USER_ROLES.ADMIN,
          status: USER_STATUS.ACTIVE,
          reportsCount: 0,
          offences: 0,
          suspensionReason: null,
          suspendedAt: null,
          banReason: null
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    )

    const usersByEmail = new Map()

    usersByEmail.set(admin.email, admin)

    for(const data of userData) {
      const user = await User.findOneAndUpdate(
        {
          email: data.email
        },
        {
          $set: {
            firstName: data.firstName,
            lastName: data.lastName,
            passwordHash,
            role: USER_ROLES.BUYER,
            status: data.status,
            reportsCount: data.reportsCount,
            offences: data.offences,
            suspensionReason: data.suspensionReason,
            suspendedAt: data.suspendedAt,
            banReason: data.banReason
          }
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      )

      usersByEmail.set(data.email, user)
    }

    const sellersByEmail = new Map()

    for(const data of sellerData) {
      const user = await User.findOneAndUpdate(
        {
          email: data.email
        },
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
            suspendedAt: null,
            banReason: null
          }
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      )

      usersByEmail.set(data.email, user)

      const seller = await Seller.findOneAndUpdate(
        {
          user: user._id
        },
        {
          $set: {
            businessName: data.businessName,
            description: data.description,
            approvalStatus:
              SELLER_APPROVAL_STATUS.APPROVED,
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

    const seededSellers = [
      ...sellersByEmail.values()
    ]

    await Report.deleteMany({})
    await Order.deleteMany({})

    await Offer.deleteMany({
      seller: {
        $in: seededSellers.map(
          seller => seller._id
        )
      }
    })

    const offers = offerData.map(data => ({
      seller: sellersByEmail.get(
        data.sellerEmail
      )._id,
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      availableQuantity: data.availableQuantity,
      unit: data.unit,
      imageUrl: null,
      isActive: true
    }))

    const createdOffers = await Offer.insertMany(
      offers
    )

    const offersByName = new Map(
      createdOffers.map(offer => [
        offer.name,
        offer
      ])
    )

    for(const data of reportData) {
      const reporter = usersByEmail.get(
        data.reporterEmail
      )

      const reportedUser = usersByEmail.get(
        data.reportedUserEmail
      )

      const buyer = usersByEmail.get(
        data.buyerEmail
      )

      const seller = sellersByEmail.get(
        data.sellerEmail
      )

      const offer = offersByName.get(
        data.offerName
      )

      if(
        !reporter ||
        !reportedUser ||
        !buyer ||
        !seller ||
        !offer
      ) {
        throw new Error(
          `Missing seed data for report involving ${data.reporterEmail}.`
        )
      }

      const order = await Order.create({
        buyer: buyer._id,
        seller: seller._id,
        offer: offer._id,
        quantity: data.quantity,
        unitPrice: offer.price,
        totalPrice:
          offer.price * data.quantity,
        status: ORDER_STATUS.COMPLETED,
        buyerNote: "",
        rejectionReason: null,
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
        reviewedBy:
          isReviewed
            ? admin._id
            : null,
        adminNote:
          isReviewed
            ? data.adminNote
            : null,
        reviewedAt:
          isReviewed
            ? data.createdAt
            : null,
        createdAt: data.createdAt,
        updatedAt: data.createdAt
      })
    }

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

    for(const result of reportCounts) {
      await User.findByIdAndUpdate(
        result._id,
        {
          $set: {
            reportsCount: result.reportsCount,
            offences: result.offences
          }
        }
      )
    }

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
      `Seed completed: ${sellerData.length} sellers and ` +
      `${createdOffers.length} offers created.`
    )

    console.log(
      `Reports created: ${reportsCount}, ` +
      `pending: ${pendingReportsCount}.`
    )

    console.log(
      `Suspended users created: ${suspendedUsers.length}`
    )

    console.log(suspendedUsers)
    console.log("Seed user password: Test1234")
    console.log(`Seed admin email: ${env.adminEmail}`)
  } catch(error) {
    console.error("Seed failed.")
    console.error(error)
    process.exitCode = 1
  } finally {
    await disconnectFromDatabase()
  }
}

await seed()
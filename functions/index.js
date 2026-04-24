const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * calculateROI
 * Calculates expected ROI for a given investment based on the associated livestock package.
 * In a real scenario, this might factor in mortality rates.
 */
exports.calculateROI = onCall(async (request) => {
  const { investmentId } = request.data;
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  if (!investmentId) {
    throw new HttpsError("invalid-argument", "investmentId is required.");
  }

  try {
    const db = admin.firestore();
    const invRef = db.collection("investments").doc(investmentId);
    const invSnap = await invRef.get();

    if (!invSnap.exists) {
      throw new HttpsError("not-found", "Investment not found.");
    }

    const investment = invSnap.data();
    
    // Simple mock logic: if it's active, maybe update currentROI based on some metric.
    // For now, let's just add 0.5% to the currentROI as a demonstration of it working.
    const currentROI = (investment.currentROI || 0) + 0.5;

    await invRef.update({
      currentROI: Number(currentROI.toFixed(2)),
      lastRoiCalculationDate: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, newROI: currentROI };
  } catch (error) {
    console.error("calculateROI error:", error);
    throw new HttpsError("internal", error.message);
  }
});

/**
 * sendNotification
 * Creates a notification document in Firestore and simulates an email send.
 */
exports.sendNotification = onCall(async (request) => {
  const { targetUserId, title, message, type = "info" } = request.data;
  
  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  if (!targetUserId || !title || !message) {
    throw new HttpsError("invalid-argument", "Missing required fields.");
  }

  try {
    const db = admin.firestore();
    const notifRef = db.collection("notifications").doc();
    
    await notifRef.set({
      userId: targetUserId,
      title,
      message,
      type,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Simulate sending email/push
    console.log(`[EMAIL SIMULATOR] Sent to user ${targetUserId}: ${title} - ${message}`);

    return { success: true, notificationId: notifRef.id };
  } catch (error) {
    console.error("sendNotification error:", error);
    throw new HttpsError("internal", error.message);
  }
});

/**
 * processInvestorPayout
 * Marks an investment as completed and issues a payout transaction.
 */
exports.processInvestorPayout = onCall(async (request) => {
  const { investmentId } = request.data;
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  if (!investmentId) {
    throw new HttpsError("invalid-argument", "investmentId is required.");
  }

  try {
    const db = admin.firestore();
    const invRef = db.collection("investments").doc(investmentId);
    
    // Use a transaction to ensure atomic update
    const result = await db.runTransaction(async (t) => {
      const invSnap = await t.get(invRef);
      if (!invSnap.exists) {
        throw new HttpsError("not-found", "Investment not found.");
      }

      const investment = invSnap.data();
      
      if (investment.status === "completed") {
        throw new HttpsError("failed-precondition", "Investment is already paid out.");
      }

      // Calculate total payout: amount + (amount * roi / 100)
      const amount = Number(investment.amount || 0);
      const roi = Number(investment.currentROI || investment.expectedROI || 0);
      const payoutAmount = amount + (amount * roi / 100);

      // Create transaction record
      const transRef = db.collection("transactions").doc();
      t.set(transRef, {
        userId: investment.investorId || uid,
        type: "payout",
        amount: payoutAmount,
        status: "completed",
        referenceId: investmentId,
        referenceType: "investment",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Update investment status
      t.update(invRef, {
        status: "completed",
        payoutAmount: payoutAmount,
        payoutDate: admin.firestore.FieldValue.serverTimestamp()
      });

      return { payoutAmount, transactionId: transRef.id };
    });

    return { success: true, ...result };
  } catch (error) {
    console.error("processInvestorPayout error:", error);
    throw new HttpsError("internal", error.message);
  }
});

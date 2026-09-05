export async function getNextOrderNumber(db) {
  const counters = db.collection('counters');
  const result = await counters.findOneAndUpdate(
    { _id: 'orderNumber' },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' }
  );

  const seq = result.seq ?? result.value?.seq ?? 1;
  const today = new Date();
  const datePart = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('');

  return `CP-${datePart}-${String(seq).padStart(4, '0')}`;
}

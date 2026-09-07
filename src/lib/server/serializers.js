const lower = (value) => (value ? String(value).toLowerCase() : value);

export function serializeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    full_name: user.fullName,
    company: user.company,
    phone: user.phone,
    note: user.note,
    role: lower(user.role),
    approval_status: lower(user.approvalStatus),
    email_verified: user.emailVerified,
    created_date: user.createdAt,
    updated_date: user.updatedAt,
  };
}

export function serializeInquiry(inquiry) {
  return {
    id: inquiry.id,
    name: inquiry.name,
    phone: inquiry.phone,
    email: inquiry.email,
    from_city: inquiry.fromCity,
    to_city: inquiry.toCity,
    distance_km: inquiry.distanceKm,
    volume: inquiry.volume,
    floors: inquiry.floors,
    heavy_items: inquiry.heavyItems,
    cargo: inquiry.cargo,
    note: inquiry.note,
    status: lower(inquiry.status),
    taken_by_id: inquiry.takenById,
    taken_by_name: inquiry.takenBy?.email || inquiry.takenBy?.fullName || null,
    commission: inquiry.commission,
    created_date: inquiry.createdAt,
    updated_date: inquiry.updatedAt,
  };
}

export function serializeArticle(article) {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    image_url: article.imageUrl,
    gallery: Array.isArray(article.gallery) ? article.gallery : [],
    videos: Array.isArray(article.videos) ? article.videos : [],
    tag: article.tag,
    meta: article.meta,
    published: article.published,
    author_name: article.authorName,
    created_date: article.createdAt,
    updated_date: article.updatedAt,
  };
}

export function serializeSettings(settings) {
  if (!settings) return null;
  return Object.fromEntries(
    Object.entries(settings).map(([key, value]) => [
      key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
      value,
    ])
  );
}

export function serializeGalleryItem(item) {
  return {
    id: item.id,
    src: item.src,
    alt: item.alt,
    tag: item.tag,
    order: item.sortOrder,
    created_date: item.createdAt,
    updated_date: item.updatedAt,
  };
}

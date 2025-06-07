
import { Card, Badge } from "react-bootstrap";
import { FaStar, FaUsers, FaCalendarAlt, FaTags, FaDice, FaLayerGroup, FaPuzzlePiece } from "react-icons/fa";

const BoardGameProfileCard = ({ game, sharedItems, similarityPercent, index, onClick }) => {
    return (
    <Card
        key={`${game.name}-${game.yearPublished || "unknown"}-${index}`}
        className="shadow-lg rounded-4 border-0"
        style={{
            display: "flex",
            flexDirection: "row",
            overflow: "hidden",
            cursor: "pointer",
            background: "linear-gradient(135deg, #ffffff 0%, rgb(247, 234, 224) 100%)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            borderLeft: "6px solid #e85d04",
        }}
        onClick={() => onClick(game.id)}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(232, 93, 4, 0.4)";
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
        }}
        >
        <div
            style={{
            flex: "0 0 250px",
            overflow: "hidden",
            borderRadius: "12px 0 0 12px",
            position: "relative",
            }}
        >
            <Card.Img
            src={game.imageUrl}
            alt={game.name}
            style={{ height: "100%", objectFit: "cover", minHeight: "200px" }}
            />

            {similarityPercent && (
                <>
                    <div
                    style={{
                        position: "absolute", top: 0, left: 0, width: 0,
                        height: 0, borderTop: "70px solid rgba(255, 223, 0, 0.95)", 
                        borderRight: "70px solid transparent",  borderTopLeftRadius: "12px",
                        pointerEvents: "none", zIndex: 2,
                    }}
                    />
                    <div
                    style={{
                        position: "absolute", top: 30, left: 0, width: "50px",
                        color: "#000", fontWeight: "700", fontSize: "0.9rem",
                        textShadow: "1px 1px 2px rgba(255, 255, 255, 0.8)",
                        transform: "rotate(-45deg)", transformOrigin: "left top",
                        pointerEvents: "none", zIndex: 3, userSelect: "none",
                        textAlign: "center", whiteSpace: "nowrap",
                    }}
                    >
                    {similarityPercent}%
                    </div>
                </>
                )}
        </div>

        <Card.Body
            style={{
            flex: 1,
            padding: "1.8rem 2rem",
            display: "flex",
            flexDirection: "column",
            color: "#1a1a1a",
            position: "relative",
            }}
        >
            <div
            style={{
                position: "absolute",
                top: 20,
                right: 20,
                backgroundColor: "#e85d04",
                color: "white",
                padding: "6px 14px",
                borderRadius: "30px",
                fontWeight: 700,
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 3px 12px rgba(232, 93, 4, 0.6)",
            }}
            title="BGG Score"
            >
            <FaStar />
            {game.bggScore !== undefined && game.bggScore !== null
                ? game.bggScore.toFixed(1)
                : "N/A"}
            </div>

            <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
            <Card.Title className="mb-0 fw-bold" style={{ fontSize: "1.6rem", color: "#e85d04" }}>
                {game.name}
            </Card.Title>
            </div>

            <Card.Text style={{ fontSize: "1rem", lineHeight: "1.5", color: "#333" }}>
            {game.description && game.description.length > 250
                ? game.description.slice(0, 250) + "..."
                : game.description || "No description."}
            </Card.Text>

            <div className="mb-3 d-flex flex-wrap gap-2">
            {(game.categories || []).map((c, i) => (
                <Badge key={`${game.name}-category-${c.name}-${i}`} game="warning" className="me-2">
                <FaTags className="me-1" /> {c.name}
                </Badge>
            ))}
            </div>

            <ul className="list-unstyled small mb-3" style={{ fontSize: "0.9rem", color: "#555" }}>
            <li><FaCalendarAlt className="me-2" /><strong>Year:</strong> {game.yearPublished || "Unknown"}</li>
            <li><FaUsers className="me-2" /><strong>Players:</strong> {game.minPlayers} – {game.maxPlayers}</li>
            </ul>

            {sharedItems && (
            <div style={{ fontSize: "0.9rem", color: "#444" }}>
                <hr />
                <p>
                <FaStar className="me-2" />
                <strong>Similarity Score:</strong> {similarityPercent}%
                </p>

                {Array.isArray(sharedItems.sharedCategories) && sharedItems.sharedCategories.length > 0 && (
                <p><FaTags className="me-2" /><strong>Shared Categories:</strong> {sharedItems.sharedCategories.join(", ")}</p>
                )}
                {Array.isArray(sharedItems.sharedMechanics) && sharedItems.sharedMechanics.length > 0 && (
                <p><FaDice className="me-2" /><strong>Shared Mechanics:</strong> {sharedItems.sharedMechanics.join(", ")}</p>
                )}
                {Array.isArray(sharedItems.sharedThemes) && sharedItems.sharedThemes.length > 0 && (
                <p><FaLayerGroup className="me-2" /><strong>Shared Themes:</strong> {sharedItems.sharedThemes.join(", ")}</p>
                )}
                {Array.isArray(sharedItems.sharedSubcategories) && sharedItems.sharedSubcategories.length > 0 && (
                <p><FaPuzzlePiece className="me-2" /><strong>Shared Subcategories:</strong> {sharedItems.sharedSubcategories.join(", ")}</p>
                )}

                <p><FaUsers className="me-2" /><strong>Shared Family:</strong> {sharedItems.sharedFamily || "None"}</p>
            </div>
            )}
        </Card.Body>
    </Card>
    )
}

export default BoardGameProfileCard
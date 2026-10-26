from sqlalchemy.orm import Session
from .models import Lawyer, Resource, Referral

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Lawyer).first() is not None:
        return

    # 1. Seed Lawyers (San Diego & California Focus)
    lawyers = [
        Lawyer(
            name="Elena Rostova",
            bar_number="CA 298412",
            firm_name="Rostova Tech & IP Law",
            location="San Diego, CA (UTC / La Jolla)",
            specialties="Intellectual Property, AI Licensing, Tech Transactions, Patents",
            hourly_rate=525,
            bio="Former BigLaw senior IP associate turned independent boutique founder. Advises high-growth AI and life sciences startups in Torrey Pines and UTC on patent strategy, licensing, and proprietary algorithms.",
            years_experience=12,
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
            verified=True,
            rating=5.0
        ),
        Lawyer(
            name="Marcus Vance",
            bar_number="CA 312589",
            firm_name="Vance Corporate Counsel",
            location="San Diego, CA (Downtown / Little Italy)",
            specialties="Corporate Formation, Venture Capital, M&A, Commercial Contracts",
            hourly_rate=475,
            bio="Solo corporate partner serving emerging California technology companies. Over $150M in seed and Series A financings closed for San Diego and SoCal startups. Active mentor at local incubators.",
            years_experience=9,
            avatar_url="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256",
            verified=True,
            rating=4.9
        ),
        Lawyer(
            name="Priya Patel",
            bar_number="CA 284091",
            firm_name="Patel Employment Legal Group",
            location="San Diego, CA (Mission Valley)",
            specialties="California Employment Law, Non-Compete Defense, Wage & Hour, Executive Severance",
            hourly_rate=495,
            bio="Advises independent founders and executives on California's evolving labor statutes, post-SB 699 restrictive covenant litigation, and remote worker compliance across multi-state workforces.",
            years_experience=14,
            avatar_url="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256",
            verified=True,
            rating=4.95
        ),
        Lawyer(
            name="David Chen",
            bar_number="CA 267334",
            firm_name="Chen Trial & Litigation Counsel",
            location="San Diego, CA (Chula Vista / Downtown)",
            specialties="Commercial Litigation, Partnership Disputes, San Diego Superior Court, Trade Secrets",
            hourly_rate=550,
            bio="Seasoned first-chair trial attorney serving as co-counsel for complex business disputes in San Diego Superior Court and the Southern District of California. Handled 30+ jury trials and arbitrations.",
            years_experience=16,
            avatar_url="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256",
            verified=True,
            rating=4.88
        ),
        Lawyer(
            name="Sarah Jenkins",
            bar_number="CA 334910",
            firm_name="Jenkins Regulatory & Health Law",
            location="Carlsbad, CA",
            specialties="Healthcare Tech, FDA Regulatory, Data Privacy (CCPA/CPRA), Clinical Trial Agreements",
            hourly_rate=450,
            bio="Dedicated regulatory counsel for digital health and medical device ventures throughout San Diego County. Extensive experience with California confidentiality of medical information and CPRA.",
            years_experience=8,
            avatar_url="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=256",
            verified=True,
            rating=4.92
        )
    ]

    for lawyer in lawyers:
        db.add(lawyer)
    db.commit()

    # Refresh lawyers to get auto-generated IDs
    for lawyer in lawyers:
        db.refresh(lawyer)

    # 2. Seed Resources for the Hive Mind
    resources = [
        Resource(
            title="California Non-Compete & Restrictive Covenants Compliance Guide (SB 699 & AB 1076)",
            practice_area="Employment Law",
            document_type="Practice Guide & Checklist",
            summary="Comprehensive analysis and employer notice templates in response to California's SB 699 and AB 1076, strictly voiding non-compete agreements and mandating individualized notice to current and former employees.",
            content="""# California Business & Professions Code §§ 16600, 16600.1, 16600.5 Compliance Guide
Contributed by Priya Patel, Esq. (Patel Employment Legal Group, San Diego, CA)

## Key Statutory Mandates:
1. **AB 1076 Codification**: Codifies Edwards v. Arthur Andersen LLP; non-compete clauses in employment contracts or non-compete agreements with employees are per se unlawful under Cal. Bus. & Prof. Code § 16600.
2. **Written Notice Requirement (§ 16600.1)**: Employers must provide individualized, written notice to both current employees and former employees (employed after Jan 1, 2022) whose contracts contained void restrictive covenants.
3. **SB 699 Extraterritorial Effect (§ 16600.5)**: Prohibits employers from attempting to enforce void covenants regardless of where or when the contract was signed, even if signed outside California.

## Model Notice Language:
"Dear [Employee Name],
Pursuant to California Business and Professions Code Section 16600.1, please be advised that any post-employment non-compete covenant or restrictive condition contained in Section [X] of your Agreement dated [Date] is void and unenforceable under California law. This notice does not invalidate provisions relating to trade secrets or non-disclosure of proprietary information protected under Cal. Civ. Code § 3426 et seq."

## Practice Pointer for Independent Counsel:
Advise corporate clients to audit all standard offer letters, consulting agreements, and stock option vesting schedules to eliminate geographic non-competition clauses.""",
            jurisdiction="California Statewide",
            tags="employment, non-compete, SB699, AB1076, trade secrets, HR compliance",
            author_id=lawyers[2].id,
            downloads_count=184,
            upvotes=42
        ),
        Resource(
            title="San Diego Superior Court Fast-Track Civil Case Management Checklist",
            practice_area="Civil Litigation",
            document_type="Litigation Practice Checklist",
            summary="Local court rules, CMC statement filing deadlines, electronic service rules, and tentative ruling protocol for the Hall of Justice and North County Regional Center.",
            content="""# San Diego Superior Court: Civil Case Management Conference (CMC) Playbook
Contributed by David Chen, Esq. (Chen Trial & Litigation Counsel, San Diego, CA)

## Local Rules Reference: San Diego County Superior Court Rule Division II
1. **Initial Case Management Conference (CRC 3.722 & SD Local Rule 2.1.3)**:
   - Typically scheduled within 120-150 days of filing complaint.
   - Case Management Statement (Form CM-110) MUST be filed and served at least 15 calendar days prior to the conference date.
2. **Meet & Confer Requirement (CRC 3.724)**:
   - Counsel must meet and confer in person or by telephone at least 30 calendar days before the CMC to discuss settlement, ADR, discovery scheduling, and electronic evidence exchanges.
3. **Department Tentative Rulings**:
   - Hall of Justice (330 W Broadway) departments post tentative rulings by 2:00 PM the court day prior to hearing.
   - If appearing remotely, use the official CourtCall or Zoom link specified in the department's general order.

## Strategic Co-Counsel Advice:
When teaming up as local co-counsel for out-of-county law firms, verify department-specific policies for ex parte applications in Dept 65 through 75.""",
            jurisdiction="California / San Diego County Superior Court",
            tags="litigation, San Diego, local rules, civil procedure, CMC, trial",
            author_id=lawyers[3].id,
            downloads_count=215,
            upvotes=59
        ),
        Resource(
            title="AI Model Vendor Services Agreement: IP Ownership, Training Data Rights & Indemnity Rider",
            practice_area="Intellectual Property & AI",
            document_type="Contract Clause & Rider",
            summary="Field-tested transactional clause specifically regulating enterprise generative AI vendors, prohibiting client data from being used in foundation model training and providing copyright indemnification.",
            content="""# Generative AI Vendor Rider & IP Protection Terms
Contributed by Elena Rostova, Esq. (Rostova Tech & IP Law, San Diego, CA)

## 1. No Training on Customer Data & Inputs
"Vendor expressly warrants and agrees that neither Customer Content, Prompt Submissions, nor Customer Output shall be retained, ingested, logged, or utilized by Vendor or any of its sub-processors for the purpose of training, tuning, evaluating, or improving any machine learning model, foundation model, or artificial intelligence system, whether proprietary to Vendor or third parties, without prior explicit written authorization from Customer."

## 2. Intellectual Property Ownership of Generated Outputs
"To the fullest extent permissible by applicable law, Customer exclusively owns all right, title, and interest in and to the Outputs generated by the Platform from Customer Prompts. Vendor hereby assigns to Customer any residual intellectual property or proprietary rights it may possess in such Outputs."

## 3. Generative AI Intellectual Property Infringement Indemnification
"Vendor shall defend, indemnify, and hold harmless Customer, its officers, directors, and employees against any third-party claim, suit, or proceeding alleging that Customer's use of the AI Services or resulting Outputs infringes or misappropriates any copyright, patent, trademark, or trade secret right of any third party." """,
            jurisdiction="California / Federal Ninth Circuit",
            tags="AI, tech transactions, IP, indemnification, vendor contracts, copyright",
            author_id=lawyers[0].id,
            downloads_count=340,
            upvotes=88
        ),
        Resource(
            title="Series Seed Preferred Stock Financing Term Sheet & Investor Rights Summary",
            practice_area="Corporate & Venture Capital",
            document_type="Model Term Sheet",
            summary="Founder-favorable seed funding term sheet tailored for California early-stage technology companies, incorporating NVCA standards with simplified 1x non-participating liquidation preference.",
            content="""# Series Seed Preferred Stock Term Sheet (Founder-Friendly NVCA Variant)
Contributed by Marcus Vance, Esq. (Vance Corporate Counsel, San Diego, CA)

## Summary of Terms:
- **Issuer**: [Startup Name], a Delaware corporation (qualified to transact business in California).
- **Securities**: Series Seed Preferred Stock.
- **Valuation**: $[X,000,000] Pre-Money Valuation.
- **Investment Amount**: $[X,000,000] aggregate cash purchase price.

## Key Protective Provisions:
1. **Liquidation Preference**: 1x Non-Participating Preferred with standard priority over Common Stock.
2. **Board of Directors**: 3 members: One designated by Lead Investor, Two designated by Common Stock (Founders).
3. **Information Rights**: Annual and quarterly financial statements delivered within 45 days of fiscal period close.
4. **Right of First Refusal & Co-Sale**: Standard secondary transaction protections with customary carve-outs for founder estate planning transfers.

## Attorney Recommendation:
Ensure founders preserve section 1202 Qualified Small Business Stock (QSBS) eligibility from inception.""",
            jurisdiction="Delaware / California",
            tags="corporate, VC, term sheet, series seed, startups, equity",
            author_id=lawyers[1].id,
            downloads_count=192,
            upvotes=51
        ),
        Resource(
            title="California Consumer Privacy Act (CCPA/CPRA) Business Vendor Data Processing Addendum (DPA)",
            practice_area="Privacy & Cybersecurity",
            document_type="Compliance Agreement",
            summary="Standard Service Provider Data Processing Addendum compliant with the California Privacy Protection Agency (CPPA) regulations governing cross-context behavioral advertising and sensitive personal info.",
            content="""# California CCPA / CPRA Service Provider Addendum
Contributed by Sarah Jenkins, Esq. (Jenkins Regulatory & Health Law, Carlsbad, CA)

## Statutory Certification (§ 1798.140(ag)):
"Vendor certifies that it is a 'Service Provider' under the California Consumer Privacy Act of 2018, as amended by the California Privacy Rights Act of 2020 (collectively, the 'CCPA'). Vendor shall not:
(i) 'Sell' or 'Share' (as defined under Civil Code § 1798.140) any Personal Information received from Customer;
(ii) Retain, use, or disclose Personal Information for any purpose other than for the business purposes specified in the Master Services Agreement;
(iii) Retain, use, or disclose Personal Information outside of the direct business relationship between Vendor and Customer; or
(iv) Combine Personal Information received from Customer with Personal Information received from or on behalf of any other person or source."

## Audit and Verification Rights:
Customer retains the right upon ten (10) business days written notice to conduct compliance assessments to verify Vendor's technical and organizational safeguards.""",
            jurisdiction="California Statewide",
            tags="privacy, CCPA, CPRA, DPA, cybersecurity, compliance",
            author_id=lawyers[4].id,
            downloads_count=128,
            upvotes=34
        )
    ]

    for res in resources:
        db.add(res)
    db.commit()

    # 3. Seed Sample Referral / Co-Counsel Request
    sample_referral = Referral(
        client_matter="San Diego Biotech Spinout Seed Financing & Tech Transfer",
        practice_area="Corporate & Venture Capital",
        jurisdiction="San Diego, CA",
        estimated_value="$15,000 - $30,000",
        notes="Client is spinning out of UC San Diego with exclusive patent license. Seeking experienced corporate co-counsel for founder equity structure and seed financing.",
        status="pending",
        referring_lawyer_id=lawyers[0].id,
        target_lawyer_id=lawyers[1].id
    )
    db.add(sample_referral)
    db.commit()

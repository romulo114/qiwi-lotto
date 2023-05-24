import Layout from "../components/layout";

const About = () => (
  <Layout>
    <div className="bg-inner mt-b-20">
      <div className="hadding inner-hadding customheader">
        <div className="wrap">
          <h1>About us</h1>
        </div>
      </div>
    </div>
    <div className="wrap">
      <div className="main-content">
        <h1 className="item-title">Our Mission</h1>
        <p>
          QIWI LOTTO GROUP owns and operates www.qiwilotto.com. We provide
          customers with an easy and interactive experience that combines
          high-end technology and easy user experience application.
        </p>
        <h1 className="item-title">Our Commitment</h1>
        <p>
          QIWI LOTTO GROUP’s mission is providing our clients with top quality
          access and service to a wide offering of official international
          lotteries worldwide. QIWI LOTTO GROUP has a dedicated team of
          well-trained customer support and sales team specialists who are able
          to provide excellent services, delivered in a timely and
          cost-effective manner to our clients all over the world.
        </p>
        <h1 className="item-title">Our Advantage</h1>
        <p>
          Our team includes a well trained and experienced professional members
          in the e-commerce and lottery industry. This combination of team
          enables us to provide our clients from all over the world a good and
          professional service. This service includes the ability to buy our
          clients the official lottery tickets they order in a timely manner and
          upload them the scanned tickets to their personal account. All
          official lottery tickets are bought from an official lottery agent at
          the local country that each lottery is held.
        </p>
        <h1 className="item-title">Contact Us</h1>
        <p>
          Send us an e-mail to:{" "}
          <a href="mailto:support@qiwilotto.com">support@qiwilotto.com</a>
        </p>
      </div>
    </div>
  </Layout>
);

export default About;

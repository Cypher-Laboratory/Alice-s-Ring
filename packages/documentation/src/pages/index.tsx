import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import { useColorMode } from '@docusaurus/theme-common';

import React from 'react';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx('hero', 'hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/overview">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

const Docs = () => {

  const { isDarkTheme } = useColorMode();

  return <div>
    <HomepageHeader />
    <main>
      <section className={styles.features}>
        <div className="container">
          <div className="row">
            <div className="col col--4">
              <div className="text--center">
                <img src={`/img/ease_of_use${isDarkTheme ? '_white' : ''}.svg`} alt="Ease of Use" className={styles.featureImage} />
              </div>
              <div className="text--center padding-horiz--md">
                <h3>Easy Integration</h3>
                <p>
                  Seamlessly integrate the Ring Signature Snap into your MetaMask wallet to enhance your privacy.
                </p>
              </div>
            </div>
            <div className="col col--4">
              <div className="text--center">
                <img src="/img/security.svg" alt="Security" className={styles.featureImage} />
              </div>
              <div className="text--center padding-horiz--md">
                <h3>Enhanced Privacy</h3>
                <p>
                  Utilize advanced cryptographic techniques to ensure your transactions and interactions remain private and secure.
                </p>
              </div>
            </div>
            <div className="col col--4">
              <div className="text--center">
                <img src={`/img/community${isDarkTheme ? '_white' : ''}.svg`} alt="Community" className={styles.featureImage} />
              </div>
              <div className="text--center padding-horiz--md">
                <h3>Open Source</h3>
                <p>
                  Contribute to our open-source project and help us build a more secure and private blockchain ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>;
};

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={`Welcome to ${siteConfig.title}`} description="Learn about the Ring Signature Snap for MetaMask">
      <Docs />
    </Layout>
  );
}

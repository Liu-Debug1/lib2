---
title: "A Lightweight FPGA-based IDS-ECU Architecture for Automotive CAN"
authors: "Shashwat Khandelwal, Shreejith Shanker"
year: 2024
arxiv_id: "2401.12234v1"
arxiv_url: "http://arxiv.org/abs/2401.12234v1"
pdf_url: "https://arxiv.org/pdf/2401.12234v1"
categories: ['cs.AR', 'cs.CR', 'cs.LG', 'eess.SY']
seed: "嵌入式汽车系统"
tags: [paper, to-read]
---

# A Lightweight FPGA-based IDS-ECU Architecture for Automotive CAN

**Shashwat Khandelwal, Shreejith Shanker** (2024)

> [!info] arXiv: [2401.12234v1](http://arxiv.org/abs/2401.12234v1) | [PDF](https://arxiv.org/pdf/2401.12234v1)

## 摘要

Recent years have seen an exponential rise in complex software-driven functionality in vehicles, leading to a rising number of electronic control units (ECUs), network capabilities, and interfaces. These expanded capabilities also bring-in new planes of vulnerabilities making intrusion detection and management a critical capability; however, this can often result in more ECUs and network elements due to the high computational overheads. In this paper, we present a consolidated ECU architecture incorporating an Intrusion Detection System (IDS) for Automotive Controller Area Network (CAN) along with traditional ECU functionality on an off-the-shelf hybrid FPGA device, with near-zero overhead for the ECU functionality. We propose two quantised multi-layer perceptrons (QMLP's) as isolated IDSs for detecting a range of attack vectors including Denial-of-Service, Fuzzing and Spoofing, which are accelerated using off-the-shelf deep-learning processing unit (DPU) IP block from Xilinx, operating fully transparently to the software on the ECU. The proposed models achieve the state-of-the-art classification accuracy for all the attacks, while we observed a 15x reduction in power consumption when compared against the GPU-based implementation of the same models quantised using Nvidia libraries. We also achieved a 2.3x speed up in per-message processing latency (at 0.24 ms from the arrival of a CAN message) to meet the strict end-to-end latency on critical CAN nodes and a 2.6x reduction in power consumption for inference when compared to the state-of-the-art IDS models on embedded IDS and loosely coupled IDS accelerators (GPUs) discussed in the literature.

## 笔记

<!-- 在此记录阅读笔记 -->

## 关键贡献

<!-- 核心方法、创新点 -->

## 与我研究的关联

<!-- 与线控底盘 / 车辆稳定性 / 域控制 / 嵌入式系统 的关联点 -->

## 参考文献追溯

<!-- 论文引用的重要文献，后续可能拓展阅读 -->
